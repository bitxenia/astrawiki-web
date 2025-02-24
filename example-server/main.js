import express from "express";
import cors from "cors";
import { setTimeout } from "timers/promises";
import dotenv from "dotenv";
import {
  openDB,
  createArticle,
  getArticle,
  updateArticle,
  getArticles,
} from "./sqlite.js";

openDB();

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/articles/:name", async (req, res) => {
  await setTimeout(5000);
  const { name } = req.params;
  try {
    const patches = await getArticle(name);

    res.status(200).json({ patches });
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(404).json({ error: "Document not found" });
    } else {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/articles", async (req, res) => {
  const { name, patch } = req.body;
  if (!name) {
    console.log("Name is required");
    return res.status(400).json({ error: "Name is required" });
  }

  const content = patch ? [patch] : null;

  const articlePatches = await getArticle(name);

  if (articlePatches) {
    console.log("Article with this name already exists");
    return res
      .status(409)
      .json({ error: "Article with this name already exists" });
  }

  try {
    // TODO: Create article with content
    const success = await createArticle(name, content);

    if (!success) {
      throw new Error("Could not create article");
    }

    console.log("Article created successfully");
    res.status(201).json({ message: "Article created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/articles/:name", async (req, res) => {
  await setTimeout(5000);
  const { name } = req.params;
  const { date, patch } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  } else if (!patch) {
    return res.status(400).json({ error: "Patch is required" });
  }

  let patches = [];

  try {
    patches = JSON.parse(await getArticle(name));
  } catch (err) {
    if (err.code !== "ENOENT") {
      return res.status(404).json({ error: `Article "${name}" not found` });
    }
  }

  patches.push({ date, patch });

  try {
    await updateArticle(name, JSON.stringify(patches));
    res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/articles", async (req, res) => {
  // TODO: Filter results optionally
  const articles = (
    await getArticles(req.query.query, req.query.offset, req.query.limit)
  ).map((article) => article.name);
  return res.status(200).json(articles);
});

app.get("/", async (_req, res) => {
  return res.status(200).json({ message: "Server is up" });
});

app.listen(PORT, () => {
  console.log(`Example server running on port ${PORT}`);
});
