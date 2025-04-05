import { Storage } from "./storage";
import { createEthImplNode, EthImpl, VersionInfo } from "@bitxenia/eth-impl";

export default class EthStorage implements Storage {
  node: EthImpl;

  constructor(node: EthImpl) {
    this.node = node;
  }

  static async create(): Promise<EthStorage> {
    const node = await createEthImplNode();
    return new EthStorage(node);
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
