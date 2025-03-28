import { createHelia } from "helia";
import { type OrbitDB, createOrbitDB } from "@orbitdb/core";
import { LevelBlockstore } from "blockstore-level";
import { LevelDatastore } from "datastore-level";
import { bitswap } from "@helia/block-brokers";
import { Libp2pOptions } from "./libp2p";
import { createLibp2p } from "libp2p";
import { loadOrCreateSelfKey } from "@libp2p/config";

/**
 * Starts an OrbitDB node.
 * @function startOrbitDB
 * @returns {Promise<OrbitDB>} The OrbitDB instance.
 */
export const startOrbitDB = async () => {
  const blockstore = new LevelBlockstore(`data/ipfs/blocks`);
  const datastore = new LevelDatastore(`data/ipfs/datastore`);
  await datastore.open();

  const privateKey = await loadOrCreateSelfKey(datastore);

  const libp2p = await createLibp2p({
    datastore,
    privateKey,
    ...Libp2pOptions,
  });

  const helia = await createHelia({
    datastore,
    blockstore,
    libp2p,
  });
  console.log(`Node started with id: ${helia.libp2p.peerId.toString()}`);

  const orbitdb = await createOrbitDB({ ipfs: helia });

  return orbitdb;
};

/**
 * Stops the OrbitDB peer and associated services.
 * @function stopOrbitDB
 * @param {Object} orbitdb The OrbitDB instance to stop.
 */
export const stopOrbitDB = async (orbitdb: OrbitDB) => {
  await orbitdb.stop();
  await orbitdb.ipfs.stop();
  await orbitdb.ipfs.blockstore.unwrap().unwrap().child.db.close();
};
