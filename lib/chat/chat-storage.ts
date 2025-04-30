import { ChatMessage } from "@bitxenia/astrachat-eth";

export interface ChatStorage {
  createChat(chatName: string): Promise<void>;

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
