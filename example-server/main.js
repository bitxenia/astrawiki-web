import express from "express";
import cors from "cors";
import { setTimeout } from "timers/promises";
import dotenv from "dotenv";
import {
  openDB,
  createArticle,
  getArticle,
  updateArticle as updateArticle,
  getArticles,
} from "./sqlite.js";

openDB();

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/articles/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const versions = await getArticle(name);
    if (!versions) {
      console.log("Article not found");
      return res.status(404).json({ error: "Article not found" });
    }
    console.log("Versions fetched! ", versions);
    return res.status(200).json({ versions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/articles", async (req, res) => {
  const { name, version } = req.body;
  if (!name) {
    console.log("Name is required");
    return res.status(400).json({ error: "Name is required" });
  }

  const content = version ? [version] : null;

  const versions = await getArticle(name);

  if (versions) {
    console.log("Article with this name already exists");
    return res
      .status(409)
      .json({ error: "Article with this name already exists" });
  }

  try {
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
  const { name } = req.params;
  const version = req.body;
  console.log(`Editing "${name} with version: ${JSON.stringify(version)}`);

  if (!version.date) {
    console.log("Date is required");
    return res.status(400).json({ error: "Date is required" });
  } else if (!version.patch) {
    console.log("Patch is required");
    return res.status(400).json({ error: "Patch is required" });
  } else if (!version.id) {
    console.log("ID is required");
    return res.status(400).json({ error: "ID is required" });
  } else if (!version.parent) {
    console.log("Parent is required");
    return res.status(400).json({ error: "Parent is required" });
  }

  let versions = [];

  try {
    const ret = await getArticle(name);
    if (!ret) {
      console.log("Article not found");
      return res.status(409).json({ error: "Article not found" });
    }
    versions = JSON.parse(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  versions.push(version);
  console.log("New versions: ", versions);

  try {
    const ret = await updateArticle(name, JSON.stringify(versions));
    if (!ret) return res.status(500).json({ error: "Internal Server Error" });
    return res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/articles", async (req, res) => {
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
