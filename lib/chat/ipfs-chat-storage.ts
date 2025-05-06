import {
  Astrachat,
  AstrachatInit,
  createAstrachat,
  ChatMessage,
} from "@bitxenia/astrachat";
import { ChatStorage } from "./chat-storage";
import { LevelBlockstore } from "blockstore-level";
import { LevelDatastore } from "datastore-level";

export default class IpfsChatStorage implements ChatStorage {
  chatNode: Astrachat;

  constructor(chatNode: Astrachat) {
    this.chatNode = chatNode;
  }

  static async create(): Promise<IpfsChatStorage> {
    const opts: AstrachatInit = {
      blockstore: new LevelBlockstore(`data/astrachat/blocks`),
      datastore: new LevelDatastore(`data/astrachat/datastore`),
    };
    const chatNode = await createAstrachat(opts);
    return new IpfsChatStorage(chatNode);
  }

  async createChat(chatName: string): Promise<void> {
    await this.chatNode.createChat(chatName);
  }

  async listenToNewMessages(
    chatName: string,
    callback: (message: ChatMessage) => void,
  ): Promise<void> {
    // TODO: note: there is a race condition here when using callback,
    //             if astradb is not thread safe it breaks because it creates 2 dbs.
    await this.chatNode.getMessages(chatName, callback);
    return;
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

  async getAlias(): Promise<string> {
    return this.chatNode.getAlias();
  }

  async setChatAlias(alias: string): Promise<void> {
    this.chatNode.setChatAlias(alias);
  }
}
