import { type OrbitDB } from "@orbitdb/core";
import { Patch } from "../ecosystem";

export class IPFSArticle {
  orbitdb: OrbitDB;
  name: string;
  patches: Patch[];
  articleDB: any;
  initialized: boolean | undefined;

  constructor(name: string, orbitdb: OrbitDB) {
    this.orbitdb = orbitdb;
    this.name = name;
    this.patches = [];
    this.initialized = false;
  }

  public async init(articleAddress: string) {
    if (this.initialized) {
      return;
    }
    // TODO: We assume that the providers are already connected. We should add a check for this.
    this.articleDB = await this.orbitdb.open(articleAddress);

    // TODO: Wait for replication to finish?

    // TODO: We should store the patches in a more efficient way.
    let patches: Patch[] = [];
    for await (const record of this.articleDB.iterator()) {
      let patch = JSON.parse(record.value);
      patches.push(patch);
    }
    this.patches = patches;

    this.initialized = true;
  }

  public async newPatch(patch: Patch) {
    this.patches.push(patch);
    await this.articleDB.add(JSON.stringify(patch));
  }
}
