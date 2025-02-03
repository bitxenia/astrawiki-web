import {
  type OrbitDB,
  ComposedStorage,
  IPFSAccessController,
  IPFSBlockStorage,
  LRUStorage,
} from "@orbitdb/core";
import { HeliaLibp2p } from "helia";
import { multiaddr } from "@multiformats/multiaddr";
import { CID } from "multiformats/cid";
import { IPFSArticle } from "./ipfsArticle";
import { LevelBlockstore } from "blockstore-level";

// This address corresponds to the name 'bitxenia-wiki'.
// TODO: Move this to a better place? JP
const DB_ADDRESS = "/orbitdb/zdpuB15HaJTQrnu2f64FQVPpFmyoByf4yW6ULNbeF5hdLeEqt";

export class ArticleRepository {
  orbitdb: OrbitDB;
  articleRepositoryDB: any;
  initialized: boolean | undefined;
  articleAddressByName: Map<string, string>;

  constructor(orbitdb: OrbitDB) {
    this.orbitdb = orbitdb;
    this.initialized = false;
    this.articleAddressByName = new Map();
  }

  public async init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.articleRepositoryDB = await this.openArticleRepositoryDB();
    for await (const record of this.articleRepositoryDB.iterator()) {
      let [articleName, articleAddress] = record.value.split("::");
      this.articleAddressByName.set(articleName, articleAddress);
    }
  }

  public async getArticle(name: string): Promise<IPFSArticle> {
    // Iterate over the records in the article repository database to find the article

    // Article protocol:
    // <article-name>::<orbitdb_article_address>
    // TODO: Implement a better protocol.
    const articleAddress = this.articleAddressByName.get(name);
    if (!articleAddress) {
      throw Error(`Article ${name} not found`);
    }
    const ipfsArticle = new IPFSArticle(name, this.orbitdb);
    await ipfsArticle.init(articleAddress);

    return ipfsArticle;
  }

  public async newArticle(name: string) {
    // Check if the article already exists
    if (this.articleAddressByName.has(name)) {
      throw Error(`Article ${name} already exists`);
    }
    // Create the article database

    // TODO: The new database needs to stay accessible for the collaborators to replicate it.
    //       See how to achieve this or change the responsibility of creating the database to
    //       the collaborators nodes.
    //       Every change is made without confirmation that it was replicated to the collaborators.
    //       One way to mitigate this is to obligate to be connected to at least one provider.
    //       Blocking the creating and editing of articles if not connected to a provider.

    // We use the default storage, found in:
    // https://github.com/orbitdb/orbitdb/blob/d290032ebf1692feee1985853b2c54d376bbfc82/src/access-controllers/ipfs.js#L56
    const storage = await ComposedStorage(
      await LRUStorage({ size: 1000 }),
      await IPFSBlockStorage({ ipfs: this.orbitdb.ipfs, pin: true }),
    );

    const newArticleDb = await this.orbitdb.open(name, {
      AccessController: IPFSAccessController({
        write: ["*"],
        storage,
      }),
    });

    let articleContentAddress = newArticleDb.address.toString();
    await this.articleRepositoryDB.add(name + "::" + articleContentAddress);
  }

  public async getArticleList(): Promise<string[]> {
    return this.articleAddressByName.keys().toArray();
  }

  private async openArticleRepositoryDB() {
    // await this.connectToProviders(this.orbitdb.ipfs);

    await this.connectToDebugProvider(this.orbitdb.ipfs);

    console.log("Attempting to open article repository database...");
    const db = await this.orbitdb.open(DB_ADDRESS);
    console.log("Database opened & replicated");

    db.events.on("update", async (entry: any) => {
      console.log("Updating database with new article:", entry.payload.value);
      let [articleName, articleAddress] = entry.payload.value.split("::");
      this.articleAddressByName.set(articleName, articleAddress);
    });

    return db;
  }

  private async connectToDebugProvider(helia: HeliaLibp2p) {
    // Local debug peer addr
    const PEER_ADDRESS_DEBUG =
      "/ip4/127.0.0.1/tcp/4002/ws/p2p/12D3KooWQrHuEaq3p71Lb5kV5f8VzeqVsnTvisvSKbtuqCzgV699";

    await helia.libp2p
      .dial(multiaddr(PEER_ADDRESS_DEBUG))
      .catch(() => console.log(`Cannot dial "${PEER_ADDRESS_DEBUG}"`)); // TODO: Raise error?
    console.log("Successfully dialed peer address");
  }

  private async connectToProviders(helia: HeliaLibp2p) {
    const parts = DB_ADDRESS.split("/");
    const cid = parts[2];
    const cidObj = CID.parse(cid);

    // TODO: Handle well the case no providers are found, which is a serius error
    //       because it means no colaborator is replicating and announcing the database
    let providers = await helia.libp2p.contentRouting.findProviders(cidObj);

    let notConnected = true;
    while (notConnected) {
      try {
        // Iterate over the providers found for the given cid of the database address
        for await (const provider of providers) {
          console.log(`Found provider: ${provider.id}`);
          // multiaddrs found
          console.log("Multiaddrs:", provider.multiaddrs.toString());

          // TODO: For some reason the provider multiaddrs are not containing the announced ipv4 addresses.
          //       For that reason we can not use this solution either until we find a way to get the ipv4 address.

          // TODO: Because of the error detail in the issue below, we need to construct the multiaddr manually.
          //       We find the secure ipv6 websocket address in the multiaddrs and use it to create the ipv4 address.
          //       This is a workaround and should be fixed in the future.
          //       Issue:
          //       https://github.com/libp2p/js-libp2p/issues/2929

          // We need to convert this (first finding this 2 from all the multiaddrs):
          // /ip6/<ipv6_addr>/tcp/44644/tls/sni/<ipv6_addr>.k51qzi5uqu5dlr08szssa4nmrja2lh5kcaoac0t3os07p5zoy6szu4xkae5scc.libp2p.direct/ws/p2p/<peer_id>
          // And this:
          // /ip4/<public_ipv4_addr>/tcp/4001/ws/p2p/<peer_id>
          // To this:
          // /ip4/<public_ipv4_addr>/tcp/4001/tls/sni/<public_ipv4_addr>.k51qzi5uqu5dlr08szssa4nmrja2lh5kcaoac0t3os07p5zoy6szu4xkae5scc.libp2p.direct/ws/p2p/<peer_id>
          let multiaddrs = provider.multiaddrs.toString().split(",");
          let ipv4AddrConstructed =
            await this.contructSecureIpv4WebsocketAddr(multiaddrs);

          // Connect to the provider
          try {
            await helia.libp2p.dial(multiaddr(ipv4AddrConstructed));
          } catch (err) {
            console.error(err);
            continue;
          }

          // The provider is now connected
          console.log("Connected to provider:", provider.id);
          notConnected = false;

          // Stop the iteration
          break;
        }
      } catch (err) {
        console.error("Error connecting to providers:", err);
        console.log("Retrying to connect to providers...");
        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // TODO: Retrying doesn't work, it freezes in the loop indefinitely.
      }
    }
  }

  private async contructSecureIpv4WebsocketAddr(peerMultiaddrs: string[]) {
    // TODO: This is a workaround and should be fixed & removed in the future.

    // Find the secure ipv6 websocket address
    let secureIpv6WebsocketAddr;
    for (const addr of peerMultiaddrs) {
      if (addr.includes("tls/sni")) {
        secureIpv6WebsocketAddr = addr;
        break;
      }
    }
    if (!secureIpv6WebsocketAddr) {
      throw new Error("No secure ipv6 websocket address found for provider");
    }

    // Find the public ipv4 address
    let ipv4Addr;
    for (let addr of peerMultiaddrs) {
      // Remove the peer id part of the address.
      addr = addr.split("/p2p/")[0];

      if (addr.includes("ip6")) {
        continue;
      }
      if (addr.includes("ws") == false) {
        continue;
      }
      // If the address is a local address, skip it
      // every addr that starts with 127, 10, 100, 192 are local addresses
      let ip = addr.split("/")[2].split(".")[0];
      let startswith = ip.split(".")[0];
      if (
        startswith == "127" ||
        startswith == "10" ||
        startswith == "100" ||
        startswith == "192"
      ) {
        continue;
      }
      ipv4Addr = addr;
      break;
    }
    if (!ipv4Addr) {
      throw new Error("No publicly routable IPv4 address found for provider");
    }

    // Construct the ipv4 address
    let ipv4AddrParts = ipv4Addr.split("/");
    // Remove the ws part wich is the 5th part
    ipv4AddrParts.splice(5, 1);

    let ipv6AddrParts = secureIpv6WebsocketAddr.split("/");

    let domain = ipv6AddrParts[7];
    // Replace the ipv6 with ipv4 in the domain
    let domainParts = domain.split(".");
    domainParts[0] = ipv4AddrParts[2].split(".").join("-");
    domain = domainParts.join(".");

    // Construct the ipv4 address
    ipv6AddrParts[7] = domain;
    // Add from the port to the end
    let ipv4AddrConstructed = ipv4AddrParts.join("/");
    ipv4AddrConstructed += "/" + ipv6AddrParts.slice(5).join("/");

    console.log("Constructed ipv4 address:", ipv4AddrConstructed);
    return ipv4AddrConstructed;
  }
}
