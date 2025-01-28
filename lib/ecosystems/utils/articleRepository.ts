import { type OrbitDB, IPFSAccessController } from "@orbitdb/core";
import { HeliaLibp2p } from "helia";
import { multiaddr } from "@multiformats/multiaddr";
import { CID } from "multiformats/cid";
import { IPFSArticle } from "./ipfsArticle";

// This address corresponds to the name 'bitxenia-wiki'.
// TODO: Move this to a better place? JP
const DB_ADDRESS = "/orbitdb/zdpuB15HaJTQrnu2f64FQVPpFmyoByf4yW6ULNbeF5hdLeEqt";

export class ArticleRepository {
  orbitdb: OrbitDB;
  articleRepositoryDB: any;
  initialized: boolean | undefined;

  constructor(orbitdb: OrbitDB) {
    this.orbitdb = orbitdb;
    this.initialized = false;
  }

  public async init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.articleRepositoryDB = await this.openArticleRepositoryDB();
  }

  public async getArticle(name: string): Promise<IPFSArticle> {
    // Iterate over the records in the article repository database to find the article

    // Article protocol:
    // <article-name>::<orbitdb_article_address>
    // TODO: Implement a better protocol.
    for await (const record of this.articleRepositoryDB.iterator()) {
      let [articleName, articleAddress] = record.value.split("::");
      if (articleName === name) {
        const ipfsArticle = new IPFSArticle(name, this.orbitdb);
        await ipfsArticle.init(articleAddress);

        return ipfsArticle;
      }
    }
    console.log(`Article ${name} not found`);
    // TODO: Handle the case where the article is not found
    throw Error("Article not found");
  }

  public async newArticle(name: string) {
    // Check if the article already exists
    for await (const record of this.articleRepositoryDB.iterator()) {
      let [articleName, _] = record.value.split("::");
      if (articleName === name) {
        console.log(`Article ${name} already exists`);
        // TODO: Handle the case where the article already exists, throw an error?
        return;
      }
    }
    // Create the article database

    // TODO: The new database needs to stay accessible for the collaborators to replicate it.
    //       See how to achieve this or change the responsibility of creating the database to
    //       the collaborators nodes.
    const newArticleDb = await this.orbitdb.open(name, {
      AccessController: IPFSAccessController({ write: ["*"] }),
    });

    let articleContentAddress = newArticleDb.address.toString();
    await this.articleRepositoryDB.articledb.add(
      name + "::" + articleContentAddress,
    );
    console.log(`Article ${name} added to the repository`);
  }

  public async getArticleList(): Promise<string[]> {
    let articleList: string[] = [];
    for await (const record of this.articleRepositoryDB.iterator()) {
      let [articleName, _] = record.value.split("::");
      articleList.push(articleName);
    }

    return articleList;
  }

  private async openArticleRepositoryDB() {
    // TODO: Dial directly to a local provider for debug reasons.
    //       Change this to the connectToProviders when internet dial is possible:
    //       await this.connectToProviders(this.orbitdb.ipfs);
    await this.connectToDebugProvider(this.orbitdb.ipfs);

    console.log("Attempting to open article repository database...");
    const db = await this.orbitdb.open(DB_ADDRESS);
    console.log("Database opened & replicated");

    return db;
  }

  private async connectToDebugProvider(helia: HeliaLibp2p) {
    // Local debug peer addr
    const PEER_ADDRESS_DEBUG =
      "/ip4/127.0.0.1/tcp/4002/ws/p2p/12D3KooWNyfnTkjW8CmEehXYm4HXpg3RAfzgG1KtCWNA1Fn8SAmR";

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
