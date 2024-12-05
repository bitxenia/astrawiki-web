const express = require('express');
const path = require('path');
const fs = require("fs").promises;

const app = express()
const port = 3001

app.get('/articles/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const contentPath = path.join(__dirname, "content", `${name}.md`);

        const content = await fs.readFile(contentPath, "utf-8");

        res.status(200).json({ content });
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(404).json({ error: "Document not found" });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

app.post('/articles', async (req, res) => {
    const { name, content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    } else if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const contentPath = path.join(__dirname, "content", `${name}.md`);

    try {
        await fs.access(contentPath);
        return res.status(409).json({ error: "Article with this name already exists" })
    } catch (err) {
        if (err.code != "ENOENT") {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    try {
        await fs.writeFile(contentPath, content, "utf-8");
        res.status(201).json({ message: "Article created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.put('/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    const contentPath = path.join(__dirname, "content", `${name}.md`);

    try {
        await fs.writeFile(contentPath, content, "utf-8");
        res.status(200).json({ message: "Article updated successfully" });
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(404).json({ error: "Document not found" });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

app.listen(port, () => {
    console.log('Example server running on port 3000');
});
