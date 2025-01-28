import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import { ArticleRepository } from "./utils/articleRepository";
import { OrbitDB } from "@orbitdb/core";

class IPFSEcosystem implements Ecosystem {
  orbitdb: OrbitDB;
  articleRepository!: ArticleRepository;

  async init() {
    this.orbitdb = await startOrbitDB();
    this.articleRepository = new ArticleRepository(this.orbitdb);
    await this.articleRepository.init();
  }

  async fetchArticle(name: string): Promise<Article> {
    console.log(`Fetching article ${name}`);
    const ipfsArticle = await this.articleRepository.getArticle(name);
    console.log(`Article ${name} fetched`);

    // TODO: Find a better way to not break encapsulation.
    let article: Article = {
      name: ipfsArticle.name,
      patches: ipfsArticle.patches,
    };

    return article;
  }

  async createArticle(name: string): Promise<null> {
    console.log(`Creating article ${name}`);
    await this.articleRepository.newArticle(name);
    console.log(`Article ${name} created`);

    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    console.log(`Editing article ${name}`);

    const ipfsArticle = await this.articleRepository.getArticle(name);
    await ipfsArticle.newPatch(patch);

    console.log(`Article ${name} edited`);

    return null;
  }

  async getArticleList(): Promise<string[]> {
    const articleList = await this.articleRepository.getArticleList();
    return articleList;
  }
}

export default IPFSEcosystem;
