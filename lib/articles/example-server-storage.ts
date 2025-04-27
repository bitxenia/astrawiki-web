import { Storage } from "./storage";
import env from "dotenv";
import {
  createExampleServerImplNode,
  ExampleServerNode,
  VersionInfo,
} from "@bitxenia/astrawiki-example-server";

env.config();

export default class ExampleServerStorage implements Storage {
  node: ExampleServerNode;

  constructor(node: ExampleServerNode) {
    this.node = node;
  }

  static async create(): Promise<ExampleServerStorage> {
    const PORT = process.env.NEXT_PUBLIC_EXAMPLE_SERVER_PORT
      ? process.env.NEXT_PUBLIC_EXAMPLE_SERVER_PORT
      : 3001;

    const URL =
      process.env.NEXT_PUBLIC_RUN_ENV === "prod"
        ? process.env.NEXT_PUBLIC_EXAMPLE_SERVER_URL
        : `http://localhost:${PORT}`;

    const node = await createExampleServerImplNode(URL!);
    return new ExampleServerStorage(node);
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
