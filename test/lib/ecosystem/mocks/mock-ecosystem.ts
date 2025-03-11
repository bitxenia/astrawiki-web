import { Article } from "../../../../lib/articles/article";
import { Version } from "../../../../lib/articles/version";
import { Ecosystem, OptIn } from "@/lib/ecosystems/ecosystem";

export class MockEcosystem implements Ecosystem {
  optIn?: OptIn | undefined;
  articles: Map<string, Article>;
  ecosystemCalls: number;

  constructor(optIn?: OptIn) {
    this.optIn = optIn;
    this.articles = new Map();
    this.ecosystemCalls = 0;
  }

  async init(): Promise<void> {}

  async fetchArticle(name: string): Promise<Article> {
    this.ecosystemCalls++;
    const article = this.articles.get(name);
    if (!article) throw Error("Article not found");
    return article;
  }

  async createArticle(name: string, version?: Version): Promise<void> {
    this.ecosystemCalls++;
    const content = version ? [version] : [];
    const article = new Article(name, content);
    this.articles.set(name, article);
  }

  async editArticle(name: string, version: Version): Promise<void> {
    this.ecosystemCalls++;
    const article = this.articles.get(name);
    if (!article) throw Error("No article found");
    const versions = article.getVersions();
    versions.push(version);
    const newArticle = new Article(name, versions);
    this.articles.set(name, newArticle);
  }

  async getArticleList(): Promise<string[]> {
    this.ecosystemCalls++;
    return this.articles.keys().toArray();
  }

  async searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    this.ecosystemCalls++;
    return this.articles
      .keys()
      .toArray()
      .filter((article) => article.includes(query))
      .slice(offset, offset + limit);
  }
}
