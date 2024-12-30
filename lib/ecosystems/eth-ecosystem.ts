import web3 from "../web3";
import { Article, Ecosystem, Patch } from "./ecosystem";
import articuloFactoryContractABI from "../../contracts/out/ArticuloFactory.json";
import articuloContractABI from "../../contracts/out/Articulo.json";
import articuloFactoryContractAddress from "../../contracts/out/deployedAddress.json";

class EthEcosystem implements Ecosystem {
  factoryInstance: any;

  constructor() {
    this.factoryInstance = new web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress
    );
  }

  async fetchArticle(name: string): Promise<Article> {
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(name)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    const articulo: Article = {
      name,
      patches,
    };
    return articulo;
  }

  async createArticle(name: string): Promise<null> {
    const accounts = await web3.eth.getAccounts();
    await this.factoryInstance.methods
      .crearArticulo(name, JSON.stringify([]))
      .send({
        from: accounts[0],
      });
    return null;
  }

  async editArticle(name: string, patch: Patch): Promise<null> {
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(name)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    patches.push(patch);
    const accounts = await web3.eth.getAccounts();
    await articuloInstance.methods
      .setContenido(JSON.stringify(patches))
      .send({ from: accounts[0] });
    return null;
  }
}

export default EthEcosystem;
