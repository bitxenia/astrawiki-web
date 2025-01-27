import { type OrbitDB } from "@orbitdb/core";
import { Patch } from "../ecosystem";

export const getArticleContent = async (
  orbitdb: OrbitDB,
  articleAddress: string,
) => {
  // TODO: We assume that the providers are already connected. We should add a check for this.
  let db = await orbitdb.open(articleAddress);

  // TODO: Wait for replication to finish?

  // TODO: We should store the patches in a more efficient way.
  let patches: Patch[] = [];
  for await (const record of db.iterator()) {
    let patch = JSON.parse(record.payload.value);
    patches.push(patch);
  }
  return patches;
};
