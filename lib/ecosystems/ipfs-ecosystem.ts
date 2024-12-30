import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import { getArticleDb } from "./utils/get_article_db";
import { getArticleContent } from "./utils/get_article_content";
import { type OrbitDB, IPFSAccessController } from "@orbitdb/core";

class IPFSEcosystem implements Ecosystem {
  orbitdb: OrbitDB;
  articleDb: any;
  initialized: boolean | undefined;

  // TODO: This should be called in the constructor, But we need to
  //       figure out how to handle async constructors.
  //       This also has a race condition. We should fix this.
  private async init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.orbitdb = await startOrbitDB();
    this.articleDb = await getArticleDb(this.orbitdb);
  }

  async fetchArticle(name: string): Promise<Article> {
    await this.init();

    // TODO: Implement a better protocol.
    // Article protocol:
    // <article-name>::<orbitdb_article_address>
    console.log(`Fetching article ${name}`);
    for await (const record of this.articleDb.iterator()) {
      let { articleName, articleAddress } = record.payload.value.split("::");
      if (articleName === name) {
        let patches = await getArticleContent(this.orbitdb, articleAddress);
        console.log(`Article ${name} fetched`);

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
    await this.init();

    // TODO: Check if article already exists

    // TODO: The new database needs to stay accessible for the collaborators to replicate it.
    //       See how to achieve this or change the responsibility of creating the database to
    //       the collaborators nodes.
    console.log(`Creating article ${name}`);
    const newArticleContentDb = await this.orbitdb.open(name, {
      AccessController: IPFSAccessController({ write: ["*"] }),
    });

    let articleContentAddress = newArticleContentDb.address.toString();
    await this.articleDb.add(name + "::" + articleContentAddress);
    console.log(`Article ${name} created`);

    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    await this.init();

    // TODO: We assume that the providers are already connected. We should add a check for this.
    console.log(`Editing article ${name}`);
    let articleDb = await this.orbitdb.open(name);
    console.log(`Article content retrieved for ${name}`);

    // TODO: Wait to replicate?
    // TODO: We should store the patches in a more efficient way.
    await articleDb.add(JSON.stringify(patch));
    console.log(`Patch added to article ${name}`);

    return null;
  }
}

export default IPFSEcosystem;
