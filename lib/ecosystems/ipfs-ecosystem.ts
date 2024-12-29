import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import { getArticlesDb } from "./utils/get_articles_db";
import { getArticleContent } from "./utils/get_article_content";
import { type OrbitDB, IPFSAccessController } from "@orbitdb/core";

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
    // TODO: Check if article already exists

    // TODO: The database needs to stay accessible for the collaborators to replicate it.
    //       See how to achieve this or change the responsibility of creating the database to
    //       the collaborators nodes.
    const newArticleDb = await this.orbitdb.open(name, {
      AccessController: IPFSAccessController({ write: ["*"] }),
    });

    let articleAddress = newArticleDb.address.toString();
    await this.articleDb.add("articleName::" + name + "::" + articleAddress);

    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    // TODO: We assume that the providers are already connected. We should add a check for this.
    let articleDb = await this.orbitdb.open(name);

    // TODO: Wait to replicate?
    // TODO: We should store the patches in a more efficient way.
    await articleDb.add(JSON.stringify(patch));

    return null;
  }
}

export default IPFSEcosystem;
