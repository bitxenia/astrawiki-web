import { Ecosystem } from "../ecosystems/ecosystem";
import { Article } from "./article";

export class ArticleCache {
  cache: Map<string, Article>;

  constructor() {
    this.cache = new Map<string, Article>();
  }

  invalidate(articleName?: string) {
    if (articleName) {
      this.cache.delete(articleName);
    } else {
      this.cache.clear();
    }
  }

  async get(name: string, ecosystem: Ecosystem): Promise<Article> {
    let article = this.cache.get(name);

    if (article === undefined) {
      article = await ecosystem.fetchArticle(name);
      this.cache.set(name, article);
    }

    return article;
  }
}
