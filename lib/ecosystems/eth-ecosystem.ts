import web3 from "../web3";
import { Ecosystem, OptIn } from "./ecosystem";
import articuloFactoryContractABI from "../../contracts/out/ArticuloFactory.json";
import articuloContractABI from "../../contracts/out/Articulo.json";
import articuloFactoryContractAddress from "../../contracts/out/deployedAddress.json";
import { Article } from "../articles/article";
import { Version } from "../articles/version";

class EthEcosystem implements Ecosystem {
  optIn?: OptIn = {
    createWithContent: true,
    optimizedSearch: false,
  };

  factoryInstance: any;

  async searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  async init(): Promise<void> {
    this.factoryInstance = new web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress,
    );
  }

  async getArticleList(): Promise<string[]> {
    return this.factoryInstance.methods.getTitulos().call();
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
      articuloAddress,
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    return new Article(name, patches);
  }

  async createArticle(name: string, version?: Version): Promise<void> {
    const accounts = await web3.eth.getAccounts();
    const contenido = version ? JSON.stringify([version]) : JSON.stringify([]);
    await this.factoryInstance.methods.crearArticulo(name, contenido).send({
      from: accounts[0],
    });
  }

  async editArticle(name: string, version: Version): Promise<void> {
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(name)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress,
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    patches.push(version);
    const accounts = await web3.eth.getAccounts();
    await articuloInstance.methods
      .setContenido(JSON.stringify(patches))
      .send({ from: accounts[0] });
  }
}

export default EthEcosystem;
