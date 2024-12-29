import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import { getArticlesDb } from "./utils/get_articles_db";
import { getArticleContent } from "./utils/get_article_content";
import { type OrbitDB } from "@orbitdb/core";

class IPFSEcosystem implements Ecosystem {
  orbitdb: OrbitDB;
  articleDb: any;

  constructor() {
    this.orbitdb = startOrbitDB();
    this.articleDb = getArticlesDb(this.orbitdb);
  }

  async fetchArticle(name: string): Promise<Article> {
    // TODO: Implement a better protocol.
    // Article protocol:
    // <article-name>::<orbitdb_article_address>

    for await (const record of this.articleDb.iterator()) {
      let { articleName, articleAddress } = record.payload.value.split("::");
      if (articleName === name) {
        let patches = await getArticleContent(this.orbitdb, articleAddress);

        let article: Article = {
          name: articleName,
          patches: patches,
        };
        return article;
      }
    }
    console.log(`Article ${name} not found`);
    let articulo: Article = {
      name: "",
      patches: [],
    };
    return articulo;
  }

  async createArticle(name: string): Promise<null> {
    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    return null;
  }
}

export default IPFSEcosystem;
