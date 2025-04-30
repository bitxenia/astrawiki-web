import { Storage, VersionInfo } from "./storage";
import { createAstrawiki, Astrawiki, AstrawikiInit } from "@bitxenia/astrawiki";
import { LevelBlockstore } from "blockstore-level";
import { LevelDatastore } from "datastore-level";

// TODO: Integrate wiki-node package to handle these methods
export default class IPFSStorage implements Storage {
  node: Astrawiki;

  private constructor(node: Astrawiki) {
    this.node = node;
  }

  static async create(): Promise<IPFSStorage> {
    const opts: AstrawikiInit = {
      blockstore: new LevelBlockstore(`data/ipfs/blocks`),
      datastore: new LevelDatastore(`data/ipfs/datastore`),
    };
    const node = await createAstrawiki(opts);
    return new IPFSStorage(node);
  }

  async getArticle(name: string, version?: string): Promise<string> {
    return (await this.node.getArticle(name, version)).content;
  }

  async createArticle(articleName: string, rawMarkdown: string): Promise<void> {
    return await this.node.newArticle(articleName, rawMarkdown);
  }

  async editArticle(articleName: string, newPlainText: string): Promise<void> {
    await this.node.editArticle(articleName, newPlainText);
  }

  async getArticleVersions(name: string): Promise<VersionInfo[]> {
    // TODO: Optimize to avoid calling getArticle twice
    return (await this.node.getArticle(name)).versionsInfo;
  }

  async getArticleList(): Promise<string[]> {
    return await this.node.getArticleList();
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
