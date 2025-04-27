import { ChatMessage } from "@bitxenia/astrachat-eth";

export type VersionInfo = {
  id: string;
  date: string;
  parent: string | null;
  mainBranch: boolean;
};

export interface Storage {
  getArticle(name: string, version?: string): Promise<string>;

  createArticle(articleName: string, rawMarkdown: string): Promise<void>;

  editArticle(articleName: string, newPlainText: string): Promise<void>;

  getArticleVersions(name: string): Promise<VersionInfo[]>;

  getArticleList(): Promise<string[]>;

  searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]>;

  isSearchOptimized(): boolean;

  /* CHAT */
  listenToNewMessages(
    chatName: string,
    callback: (message: ChatMessage) => void,
  ): Promise<void>;

  getChatMessages(chatName: string): Promise<ChatMessage[]>;

  sendChatMessage(
    chatName: string,
    message: string,
    parentId?: string,
  ): Promise<void>;
}
