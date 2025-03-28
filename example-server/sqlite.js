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
        'CREATE TABLE IF NOT EXISTS articles (name TEXT PRIMARY KEY NOT NULL, versions TEXT DEFAULT "[]")',
      );
    } catch (dbError) {
      console.error(dbError);
    }
  });
}

export async function getArticle(articleName) {
  console.log(`Getting ${articleName}`);
  const article = await db.get(
    "SELECT versions FROM articles WHERE name = ?",
    articleName,
  );

  return article ? article.versions : null;
}

export async function createArticle(articleName, versions) {
  const content = JSON.stringify(versions);
  try {
    const { changes } = await db.run(
      "INSERT INTO articles (name, versions) VALUES (?, ?)",
      [articleName, content],
    );
    return changes > 0;
  } catch (err) {
    throw Error(err);
  }
}
export async function updateArticle(articleName, versions) {
  try {
    const { changes } = await db.run(
      "UPDATE articles SET versions = ? WHERE name = ?",
      [versions, articleName],
    );
    return changes > 0;
  } catch (err) {
    throw Error(err);
  }
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

  return await db.all(sql, ...params);
}
