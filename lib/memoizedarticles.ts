import { Article } from "./ecosystems/article";
import { Ecosystem } from "./ecosystems/ecosystem";

export class MemoizedArticles {
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

  async get(articleName: string, ecosystem: Ecosystem): Promise<Article> {
    let article = this.cache.get(articleName);

    if (article === undefined) {
      article = await ecosystem.fetchArticle(articleName);
      this.cache.set(articleName, article);
    }

    return article;
  }
}
