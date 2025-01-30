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

    // TODO: We use the default storage, found in:
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
    // TODO: Dial directly to a local provider for debug reasons.
    //       Change this to the connectToProviders when internet dial is possible:
    //       await this.connectToProviders(this.orbitdb.ipfs);
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
      "/ip4/127.0.0.1/tcp/4002/ws/p2p/12D3KooWKkmkMjhgRBMbeaMJvSXGd3MGiY3TfXZM8BkuBANnKB4K";

    await helia.libp2p
      .dial(multiaddr(PEER_ADDRESS_DEBUG))
      .catch(() => console.log(`Cannot dial "${PEER_ADDRESS_DEBUG}"`)); // TODO: Raise error?
    console.log("Successfully dialed peer address");
  }

  private async connectToProviders(helia: HeliaLibp2p) {
    const parts = DB_ADDRESS.split("/");
    const cid = parts[2];
    const cidObj = CID.parse(cid);

    // TODO: Handle the case no providers are found, which is a serius error
    //       because it means no colaborator is replicating and announcing the database
    let providers = await helia.libp2p.contentRouting.findProviders(cidObj);

    let currentExponensialBackoff = 1;
    let notConnected = true;
    while (notConnected) {
      // TODO: Add a limit to the number of retries
      // wait the exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, currentExponensialBackoff * 1000),
      );
      try {
        // Iterate over the providers found for the given cid of the database address
        for await (const provider of providers) {
          console.log(`Found provider: ${provider.id}`);

          // multiaddrs found
          console.log("Multiaddrs:", provider.multiaddrs.toString());

          // Connect to the provider
          try {
            await helia.libp2p.dial(provider.multiaddrs);
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
        console.error(err);
        console.log("Retrying to connect to providers...");

        currentExponensialBackoff = Math.min(
          2 ** currentExponensialBackoff,
          60,
        );
        continue;
      }
    }
  }
}
