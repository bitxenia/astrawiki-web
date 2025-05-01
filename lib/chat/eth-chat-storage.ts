import {
  ChatManager,
  ChatMessage,
  createChatManager,
} from "@bitxenia/astrachat-eth";
import { ChatStorage } from "./chat-storage";

export default class EthChatStorage implements ChatStorage {
  chatNode: ChatManager;

  constructor(chatNode: ChatManager) {
    this.chatNode = chatNode;
  }

  static async create(): Promise<EthChatStorage> {
    const chatNode = await createChatManager();
    return new EthChatStorage(chatNode);
  }

  async createChat(chatName: string): Promise<void> {
    this.chatNode.createChat(chatName);
  }

  async listenToNewMessages(
    chatName: string,
    callback: (message: ChatMessage) => void,
  ): Promise<void> {
    return this.chatNode.listenToNewMessages(chatName, callback);
  }

  async getChatMessages(chatName: string): Promise<ChatMessage[]> {
    return this.chatNode.getMessages(chatName);
  }

  async sendChatMessage(
    chatName: string,
    message: string,
    parentId?: string,
  ): Promise<void> {
    return this.chatNode.sendMessage(chatName, message, parentId);
  }
}
