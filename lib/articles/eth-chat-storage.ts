import { Storage, VersionInfo } from "./storage";
import { ChatManager, ChatMessage } from "@bitxenia/astrachat-eth";

export default class EthStorage implements Storage {
  node: ChatManager;

  constructor(node: ChatManager) {
    this.node = node;
  }
  listenToNewMessages(
    chatName: string,
    callback: (message: ChatMessage) => void,
  ): Promise<void> {
    throw new Error("Method not implemented.");
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
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  isSearchOptimized(): boolean {
    throw new Error("Method not implemented.");
  }

  /* CHAT */

  getChatMessages(chatName: string): Promise<ChatMessage[]> {
    return this.node.getMessages(chatName);
  }

  sendChatMessage(chatName: string, message: string): Promise<void> {
    return this.node.sendMessage(chatName, message);
  }
}
