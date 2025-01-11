import { Article, Ecosystem } from "./ecosystems/ecosystem";

export class MemoizedArticles {
  cache: Map<string, Article>;

  constructor() {
    this.cache = new Map<string, Article>();
  }

  invalidate(articleName: string) {
    this.cache.delete(articleName);
  }

  async get(articleName: string, ecosystem: Ecosystem): Promise<Article> {
    let article = this.cache.get(articleName);

    if (article === undefined) {
      article = await ecosystem.fetchArticle(articleName);
      this.cache.set(articleName, article);
    }

    return article;
  }
}
