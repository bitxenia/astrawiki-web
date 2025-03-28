import { Article, Ecosystem, OptIn } from "./ecosystem";
import { startOrbitDB } from "./utils/startOrbitdb";
import { ArticleRepository } from "./utils/articleRepository";
import { OrbitDB } from "@orbitdb/core";
import { Version } from "../articles/version";

class IPFSEcosystem implements Ecosystem {
  optIn?: OptIn | undefined;
  searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  orbitdb!: OrbitDB;
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
    let article = new Article(ipfsArticle.name, ipfsArticle.patches);
    console.log("Article: ", article);

    return article;
  }

  async createArticle(name: string, version?: Version): Promise<void> {
    console.log(`Creating article ${name}`);
    await this.articleRepository.newArticle(name);
    console.log(`Article ${name} created`);
  }

  async editArticle(name: string, version: Version): Promise<void> {
    console.log(`Editing article ${name}`);

    const ipfsArticle = await this.articleRepository.getArticle(name);
    await ipfsArticle.newPatch(version);

    console.log(`Article ${name} edited`);
  }

  async getArticleList(): Promise<string[]> {
    const articleList = await this.articleRepository.getArticleList();
    return articleList;
  }
}

export default IPFSEcosystem;
