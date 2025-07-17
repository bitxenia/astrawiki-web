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

  static async create(loginKey?: string): Promise<IpfsChatStorage> {
    const opts: AstrachatInit = {
      blockstore: new LevelBlockstore(`data/astrachat/blocks`),
      datastore: new LevelDatastore(`data/astrachat/datastore`),
      logLevel: "debug",
      loginKey,
      bootstrapProviderPeers: [
        "/ip4/181.167.193.209/udp/50001/webrtc-direct/certhash/uEiD5NmjXWbohsPBCt8TzfeawpelfoMPYTohcjScghY-gfg/p2p/12D3KooWMeL4aq9QAx5LFFgdQB3Hxy74x3af1fi1R6atGhmzDwFK",
      ],
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

  async getLoginKey(): Promise<string> {
    return await this.chatNode.getLoginKey();
  }

  getUserId(): string {
    return this.chatNode.getUserId();
  }
}
