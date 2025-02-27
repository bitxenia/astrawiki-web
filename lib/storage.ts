import { Ecosystem, Patch } from "./ecosystems/ecosystem";
import { getPatchFromTwoTexts, getTextFromPatches } from "./diff";
import { ArticleCache } from "./cache";

export class Storage {
  cache: ArticleCache;
  ecosystem: Ecosystem;

  constructor(ecosystem: Ecosystem) {
    this.cache = new ArticleCache();
    this.ecosystem = ecosystem;
  }

  /**
   * Fetches article from the given ecosystem and builds from patches.
   * @param name Name of the article, case sensitive.
   * @param articleVersion Version to build article from. Latest if null.
   * @returns article as raw markdown (without frontmatter).
   */
  async getArticle(name: string, version?: string): Promise<string> {
    const article = await this.cache.get(name, this.ecosystem);
    const patches = version
      ? article.getPatchBranch(version)
      : article.getMainPatchBranch();
    return getTextFromPatches(patches);
  }

  /**
   * Creates article in the ecosystem.
   * @param articleName name of the article to create
   * @param rawMarkdown content of the article
   */
  async createArticle(articleName: string, rawMarkdown: string) {
    const patch = getPatchFromTwoTexts("", rawMarkdown, null);
    if (this.ecosystem.optIn?.createWithContent) {
      await this.ecosystem.createArticle(articleName, patch);
      console.log("Article created successfully!");
    } else {
      await this.ecosystem.createArticle(articleName);
      console.log("Empty article created successfully!");
      await this.ecosystem.editArticle(articleName, patch);
    }
  }

  /**
   * Builds patch and publishes update to the given ecosystem. Also invalidates
   * the cache for the given article to force fetch the article again.
   * @param articleName name of the article to edit
   * @param oldPlainText raw markdown of the old version
   * @param newPlainText raw markdown of the updated version
   * @param ecosystem ecosystem to edit the article on
   */
  async editArticle(
    articleName: string,
    oldPlainText: string,
    newPlainText: string,
  ) {
    const article = await this.cache.get(articleName, this.ecosystem);
    const parentId = article.getParentPatchId();
    const patch = getPatchFromTwoTexts(oldPlainText, newPlainText, parentId);
    this.ecosystem.editArticle(articleName, patch);
    this.cache.invalidate(articleName);
  }

  /**
   * Gets article patches from the given ecosystem.
   * @param name Name of the article, case sensitive.
   * @returns Array of patches from the article.
   */
  async getArticlePatches(name: string): Promise<Patch[]> {
    const article = await this.cache.get(name, this.ecosystem);
    return article.getPatches();
  }

  /**
   * Returns list of all articles in the ecosystem
   */
  async getArticleList(): Promise<string[]> {
    return this.ecosystem.getArticleList();
  }

  /**
   * Searches articles using pagination
   * @param query input to match article names from
   * @param limit amount of results to return
   * @param offset article from where to start from
   * @returns list of results
   */
  async searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    return this.ecosystem.searchArticles(query, limit, offset);
  }

  isSearchOptimized(): boolean {
    if (!this.ecosystem.optIn) return false;
    return this.ecosystem.optIn.optimizedSearch;
  }
}
