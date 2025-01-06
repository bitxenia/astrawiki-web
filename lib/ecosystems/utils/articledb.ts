import { type OrbitDB } from "@orbitdb/core";
import { CID } from "multiformats/cid";

// This address corresponds to the name 'bitxenia-wiki'.
// TODO: Move this to a better place? JP
const DB_ADDRESS = "/orbitdb/zdpuB15HaJTQrnu2f64FQVPpFmyoByf4yW6ULNbeF5hdLeEqt";

export class ArticleDB {
  orbitdb: OrbitDB;
  articledb: any;
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
    this.articledb = await this.getArticleDb();
  }

  private async getArticleDb() {
    await this.connectToProviders(this.orbitdb.ipfs);
    let db = await this.replicateDatabase(this.orbitdb);

    return db;
  }

  private async connectToProviders(helia: any) {
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
        setTimeout(resolve, currentExponensialBackoff * 1000)
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
          60
        );
        continue;
      }
    }
  }

  private async waitFor(valueA: any, toBeValueB: any, pollInterval = 100) {
    return new Promise<void>((resolve) => {
      const interval = setInterval(async () => {
        if ((await valueA()) === (await toBeValueB())) {
          clearInterval(interval);
          resolve();
        }
      }, pollInterval);
    });
  }

  private async replicateDatabase(orbitdb: OrbitDB) {
    console.log("Attempting to open articles database...");
    const db = await orbitdb.open(DB_ADDRESS);
    console.log("Database opened");

    let replicated = false;

    const onJoin = async (peerId: any, heads: any) => {
      replicated = true;
    };
    db.events.on("join", onJoin);

    await this.waitFor(
      () => replicated,
      () => true
    );
    console.log("Database replicated");

    return db;
  }
}
