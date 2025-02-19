import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPath = "./.data/database.db";
let db;

export async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  }).then(async (dBase) => {
    db = dBase;

    try {
      await db.run(
        'CREATE TABLE IF NOT EXISTS articles (name TEXT PRIMARY KEY NOT NULL, patches TEXT DEFAULT "[]")',
      );
    } catch (dbError) {
      console.error(dbError);
    }
  });
}

export async function getArticle(articleName) {
  console.log(`Getting ${articleName}`);
  const article = await db.get(
    "SELECT patches FROM articles WHERE name = ?",
    articleName,
  );

  return article ? article.patches : null;
}

export async function createArticle(articleName, patches) {
  let success = false;

  const content = JSON.stringify(patches);

  try {
    success = await db.run(
      "INSERT INTO articles (name, patches) VALUES (?, ?)",
      [articleName, content ?? null],
    );
  } catch (dbError) {
    console.error(dbError);
  }

  return success.changes > 0;
}
export async function updateArticle(articleName, patches) {
  let success = false;
  try {
    success = db.run(
      "UPDATE articles SET patches = ? WHERE name = ?",
      patches,
      articleName,
    );
  } catch (dbError) {
    console.error(dbError);
  }

  return success.changes > 0;
}

export async function getArticles(query, offset, limit) {
  let sql = "SELECT name FROM articles";
  const params = [];

  if (query) {
    sql += " WHERE name LIKE ?";
    params.push(`%${query}%`);
  }
  if (offset !== undefined && limit !== undefined) {
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }
  console.log("DEBUGPRINT[13]: sqlite.js:74: sql=", sql);

  return await db.all(sql, ...params);
}
