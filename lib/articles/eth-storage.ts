import {
  ChatManager,
  ChatMessage,
  createChatManager,
} from "@bitxenia/astrachat-eth";
import { Storage } from "./storage";
import {
  createEthImplNode,
  EthImpl,
  VersionInfo,
} from "@bitxenia/astrawiki-eth";

export default class EthStorage implements Storage {
  node: EthImpl;
  chatNode: ChatManager;

  constructor(node: EthImpl, chatNode: ChatManager) {
    this.node = node;
    this.chatNode = chatNode;
  }

  static async create(): Promise<EthStorage> {
    const node = await createEthImplNode();
    const chatNode = await createChatManager();
    return new EthStorage(node, chatNode);
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

  /* CHAT */

  getChatMessages(chatName: string): Promise<ChatMessage[]> {
    return this.chatNode.getMessages(chatName);
  }

  sendChatMessage(chatName: string, message: string): Promise<void> {
    return this.chatNode.sendMessage(chatName, message);
  }
}
