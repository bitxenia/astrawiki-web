import { createHelia, Helia } from "helia";
import { type OrbitDB, createOrbitDB } from "@orbitdb/core";
import { LevelBlockstore } from "blockstore-level";
import { bitswap } from "@helia/block-brokers";
import { Libp2pOptions } from "./libp2p";
import { CID } from "multiformats/cid";

/**
 * Starts an OrbitDB node.
 * @function startOrbitDB
 * @returns {Promise<OrbitDB>} The OrbitDB instance.
 */
export const startOrbitDB = async () => {
  const blockstore = new LevelBlockstore(`data/ipfs/blocks`);

  const helia = await createHelia({
    libp2p: { ...Libp2pOptions },
    blockstore,
    blockBrokers: [bitswap()],
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
