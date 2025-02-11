import express from "express";
import path from "path";
import cors from "cors";
import { readFile, writeFile, access, readdir } from "node:fs/promises";
import { setTimeout } from "timers/promises";
import dotenv from "dotenv";
import { dirname } from "node:path"; // For Node 16
import { fileURLToPath } from "node:url"; // For Node 16

const __dirname = import.meta.dirname
  ? import.meta.dirname
  : dirname(fileURLToPath(import.meta.url));

const db = require("./sqlite.js");

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/articles/:name", async (req, res) => {
  await setTimeout(5000);
  const { name } = req.params;
  try {
    const patchesPath = path.join(__dirname, "content", `${name}.json`);

    const patches = await readFile(patchesPath, "utf-8");

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
  await setTimeout(5000);
  const { name } = req.body;
  if (!name) {
    console.log("Name is required");
    return res.status(400).json({ error: "Name is required" });
  }

  const patchesPath = path.join(__dirname, "content", `${name}.json`);

  try {
    await access(patchesPath);
    console.log("Article with this name already exists");
    return res
      .status(409)
      .json({ error: "Article with this name already exists" });
  } catch (err) {
    if (err.code != "ENOENT") {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  try {
    await writeFile(patchesPath, "[]", "utf-8");
    console.log("Empty article created successfully");
    res.status(201).json({ message: "Empty article created successfully" });
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
  const patchesPath = path.join(__dirname, "content", `${name}.json`);
  let patches = [];
  try {
    patches = JSON.parse(await readFile(patchesPath, "utf-8"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      return res.status(404).json({ error: `File "${patchesPath}" not found` });
    }
  }

  patches.push({ date, patch });

  try {
    await writeFile(patchesPath, JSON.stringify(patches), "utf-8");
    res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/articles", async (_req, res) => {
  const contentPath = path.join(__dirname, "content");
  const articles = (await readdir(contentPath)).map((filename) =>
    filename.replace(".json", ""),
  );
  await setTimeout(5000);
  return res.status(200).json(articles);
});

app.get("/", async (_req, res) => {
  return res.status(200).json({ message: "Server is up" });
});

app.listen(PORT, () => {
  console.log(`Example server running on port ${PORT}`);
});
