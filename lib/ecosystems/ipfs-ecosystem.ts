import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import { ArticleDB } from "./utils/articledb";
import { getArticleContent } from "./utils/get_article_content";
import { OrbitDB } from "@orbitdb/core";
import { IPFSAccessController } from "@orbitdb/core";

class IPFSEcosystem implements Ecosystem {
  getArticleList(): Promise<string[]> {
    return Promise.resolve([]);
  }
  orbitdb: OrbitDB;
  articleRepository: any;

  // TODO: This should be called in the constructor, But we need to
  //       figure out how to handle async constructors.
  //       This also has a race condition. We should fix this.
  async init() {
    this.orbitdb = await startOrbitDB();
    this.articleRepository = new ArticleDB(this.orbitdb);
    await this.articleRepository.init();
  }

  async fetchArticle(name: string): Promise<Article> {
    // TODO: Implement a better protocol.
    // Article protocol:
    // <article-name>::<orbitdb_article_address>
    console.log(`Fetching article ${name}`);
    for await (const record of this.articleRepository.articledb.iterator()) {
      console.log("Record: ", record);
      let [articleName, articleAddress] = record.value.split("::");
      if (articleName === name) {
        let patches = await getArticleContent(this.orbitdb, articleAddress);
        console.log(`Article ${name} fetched`);

        let article: Article = {
          name: articleName,
          patches: patches,
        };
        console.log("Article fetched: ", article);
        return article;
      }
    }
    console.log(`Article ${name} not found`);
    let article: Article = {
      name: "",
      patches: [],
    };
    return article;
  }

  async createArticle(name: string): Promise<null> {
    // TODO: Check if article already exists

    // TODO: The new database needs to stay accessible for the collaborators to replicate it.
    //       See how to achieve this or change the responsibility of creating the database to
    //       the collaborators nodes.
    console.log(`Creating article ${name}`);
    const newArticleContentDb = await this.orbitdb.open(name, {
      AccessController: IPFSAccessController({ write: ["*"] }),
    });

    let articleContentAddress = newArticleContentDb.address.toString();
    await this.articleRepository.articledb.add(
      name + "::" + articleContentAddress,
    );
    console.log(`Article ${name} created`);

    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    // TODO: We assume that the providers are already connected. We should add a check for this.
    console.log(`Editing article ${name}`);
    let address = "";
    for await (const record of this.articleRepository.articledb.iterator()) {
      let [articleName, articleAddress] = record.value.split("::");
      if (articleName === name) {
        address = articleAddress;
        break;
      }
    }
    if (!address) {
      throw Error("Article not found");
    }
    const articleDb = await this.orbitdb.open(address);
    console.log(`Article content retrieved for ${name}: ${articleDb.address}`);

    // TODO: Wait to replicate?
    // TODO: We should store the patches in a more efficient way.
    await articleDb.add(JSON.stringify(patch));
    console.log(`Patch added to article ${name}`);
    console.log("Article content: ", await articleDb.all());

    return null;
  }
}

export default IPFSEcosystem;
