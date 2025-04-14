import { ChatMessage } from "@bitxenia/astrachat-eth";
import { Ecosystem } from "../ecosystems/ecosystem";
import { ArticleCache } from "./cache";
import { Storage, VersionInfo } from "./storage";
import { compileTextFromVersions, createVersion } from "./version";

export class EcosystemBasedStorage implements Storage {
  cache: ArticleCache;
  ecosystem: Ecosystem;

  constructor(ecosystem: Ecosystem) {
    this.cache = new ArticleCache();
    this.ecosystem = ecosystem;
  }
  getChatMessages(chatName: string): Promise<ChatMessage[]> {
    throw new Error("Method not implemented.");
  }
  sendChatMessage(chatName: string, message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Fetches article from the given ecosystem and builds from patches.
   * @param name Name of the article, case sensitive.
   * @param articleVersion Version to build article from. Latest if null.
   * @returns article as raw markdown (without frontmatter).
   */
  async getArticle(name: string, version?: string): Promise<string> {
    const article = await this.cache.get(name, this.ecosystem);
    console.log("Fetched article! ", JSON.stringify(article));
    console.log("Versions! ", article.getVersions());
    const versions = version
      ? article.getBranch(version)
      : article.getMainBranch();
    return compileTextFromVersions(versions);
  }

  /**
   * Creates article in the ecosystem.
   * @param articleName name of the article to create
   * @param rawMarkdown content of the article
   */
  async createArticle(articleName: string, rawMarkdown: string) {
    const version = createVersion("", rawMarkdown, null);
    if (this.ecosystem.optIn?.createWithContent) {
      await this.ecosystem.createArticle(articleName, version);
      console.log("Article created successfully!");
    } else {
      await this.ecosystem.createArticle(articleName);
      console.log("Empty article created successfully!");
      await this.ecosystem.editArticle(articleName, version);
    }
  }

  /**
   * Builds new article version and publishes it to the given ecosystem. Also
   * invalidates the cache for the given article to force fetch the article
   * again.
   * @param articleName name of the article to edit
   * @param newPlainText raw markdown of the updated version
   * @param ecosystem ecosystem to edit the article on
   */
  async editArticle(articleName: string, newPlainText: string) {
    const article = await this.cache.get(articleName, this.ecosystem);
    const oldPlainText = compileTextFromVersions(article.getMainBranch());
    const parent = article.getLastVersion();
    const version = createVersion(oldPlainText, newPlainText, parent);
    console.log("Version created! ", version);
    this.ecosystem.editArticle(articleName, version);
    this.cache.invalidate(articleName);
  }

  /**
   * Gets article versions from the given ecosystem.
   * @param name Name of the article, case sensitive.
   * @returns Array of versions from the article.
   */
  async getArticleVersions(name: string): Promise<VersionInfo[]> {
    const article = await this.cache.get(name, this.ecosystem);
    const mainBranch: Set<string> = new Set(
      article.getMainBranch().map((version) => version.id),
    );
    return article.getVersions().map((version) => {
      return {
        id: version.id,
        parent: version.parent,
        date: version.date,
        mainBranch: mainBranch.has(version.id),
      };
    });
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
