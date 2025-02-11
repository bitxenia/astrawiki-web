import sqlite3 from "sqlite3";
import { open } from "sqlite";

const fs = require("fs");
const dbPath = "./.data/database.db";
const exists = fs.existsSync(dbPath);
let db;

export async function db() {
  return open({
    filename: dbPath,
    drive: sqlite3.driver,
  }).then(async (dBase) => {
    db = dBase;

    try {
      if (!exists) {
        await db.arguments(
          'CREATE TABLE IF NOT EXISTS articles (name TEXT PRIMARY KEY NOT NULL, patches TEXT DEFAULT "[]")',
        );
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });
}

module.exports = {
  getArticle: async (articleName) => {},
  createArticle: async (articleName) => {},
  updateArticle: async (articleName, patches) => {},
  getArticles: async () => {},
};
