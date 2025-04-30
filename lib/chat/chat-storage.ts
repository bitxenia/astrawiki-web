import { ChatMessage } from "@bitxenia/astrachat-eth";

export interface ChatStorage {
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
