import { Article, Ecosystem, Patch } from "./ecosystem";
import { startOrbitDB } from "./utils/start_orbitdb";
import {type OrbitDB} from "@orbitdb/core";


class IPFSEcosystem implements Ecosystem {
    orbitdb: OrbitDB;

    constructor() {
        this.orbitdb = startOrbitDB();
    }

  async fetchArticle(name: string): Promise<Article> {
    let articulo: Article = {
      name: "Articulo",
      patches: []
    };
    return articulo;
  }

  async createArticle(name: string): Promise<null> {
    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    return null;
  }
}

export default IPFSEcosystem;