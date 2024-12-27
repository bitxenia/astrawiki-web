import express from "express";
import path from "path";
import cors from "cors";
import { readFile, writeFile, access } from "node:fs/promises";
const __dirname = import.meta.dirname;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/articles/:name", async (req, res) => {
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

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Server is up" });
});

app.listen(port, () => {
  console.log("Example server running on port 3001");
});
