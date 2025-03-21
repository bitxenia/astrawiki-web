import { Storage, VersionInfo } from "./storage";

// TODO: Integrate wiki-node package to handle these methods
export default class IPFSStorage implements Storage {
  constructor() {
    throw new Error("Class not implemented.");
  }

  getArticle(name: string, version?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  createArticle(articleName: string, rawMarkdown: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  editArticle(articleName: string, newPlainText: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getArticleVersions(name: string): Promise<VersionInfo[]> {
    throw new Error("Method not implemented.");
  }
  getArticleList(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  searchArticles(
    _query: string,
    _limit: number,
    _offset: number,
  ): Promise<string[]> {
    throw new Error("Method not supported.");
  }
  isSearchOptimized(): boolean {
    return false;
  }
}
