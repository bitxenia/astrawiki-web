import { type OrbitDB } from "@orbitdb/core";
import { CID } from "multiformats/cid";

// This address corresponds to the name 'bitxenia-wiki'.
// TODO: Move this to a better place? JP
const DB_ADDRESS = "/orbitdb/zdpuB15HaJTQrnu2f64FQVPpFmyoByf4yW6ULNbeF5hdLeEqt";

export const getArticleDb = async (orbitdb: OrbitDB) => {
  await connect_to_providers(orbitdb.ipfs);
  let db = await replicate_database(orbitdb);

  return db;
};

const connect_to_providers = async (helia: any) => {
  const parts = DB_ADDRESS.split("/");
  const cid = parts[2];
  const cidObj = CID.parse(cid);

  // Iterate over the providers found for the given cid of the database address
  for await (const provider of helia.libp2p.contentRouting.findProviders(
    cidObj
  )) {
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

    // Stop the iteration
    break;
  }
};

const waitFor = async (valueA: any, toBeValueB: any, pollInterval = 100) => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(async () => {
      if ((await valueA()) === (await toBeValueB())) {
        clearInterval(interval);
        resolve();
      }
    }, pollInterval);
  });
};

const replicate_database = async (orbitdb: OrbitDB) => {
  console.log("Attempting to open articles database...");
  const db = await orbitdb.open(DB_ADDRESS);
  console.log("Database opened");

  let replicated = false;

  const onJoin = async (peerId: any, heads: any) => {
    replicated = true;
  };
  db.events.on("join", onJoin);

  await waitFor(
    () => replicated,
    () => true
  );
  console.log("Database replicated");

  return db;
};
