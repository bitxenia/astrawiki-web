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
      blockstore: new LevelBlockstore(`data/astrawiki/blocks`),
      datastore: new LevelDatastore(`data/astrawiki/datastore`),
      bootstrapProviderPeers: [
        "/ip4/181.167.193.209/udp/40001/webrtc-direct/certhash/uEiCuuW2KJhA9CPThwnpbWOwz4hpCQRhhKd3McX6Iy6Xdog/p2p/12D3KooWBRk9RC9imoLYB3C6A18RNjyFhvKcpQNLJodgT3NEZ7VZ",
      ],
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
