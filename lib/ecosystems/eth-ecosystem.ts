import { BaseMdxFrontmatter, parseMdx } from "../markdown";
import web3 from "../web3";
import { Article, Ecosystem, Patch } from "./ecosystem";

// TODO: move this to a separate file
const articuloFactoryContractAddress =
  "0xf7a2ab39EE76E59937CD6E2FF41a900DFF1D7fce";
const articuloFactoryContractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "titulo",
        type: "string",
      },
      {
        internalType: "string",
        name: "contenido",
        type: "string",
      },
    ],
    name: "crearArticulo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "articulos",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getArticulos",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "tituloToAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const articuloContractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_titulo",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contenido",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "contenido",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contenido",
        type: "string",
      },
    ],
    name: "setContenido",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_titulo",
        type: "string",
      },
    ],
    name: "setTitulo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "titulo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

class EthEcosystem implements Ecosystem {
  async fetchArticle(name: string): Promise<Article> {
    const factoryInstance = new web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress
    );
    const articuloAddress: string = await factoryInstance.methods
      .tituloToAddress(name)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    console.log(`Articulo address: ${articuloAddress}`);
    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    console.log(`Contenido: ${contenido}`);
    const parsedMdx = await parseMdx<BaseMdxFrontmatter>(contenido);
    console.log(`Parsed content: ${JSON.stringify(parsedMdx)}`);
    const articulo: Article = {
      name,
      patches: [{ date: "", patch: contenido }],
    };
    return articulo;
  }

  async createArticle(name: string): Promise<null> {
    const factoryInstance = new web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress
    );
    const contenido = `---
title: ${name}
description: ""
---
`;
    const accounts = await web3.eth.getAccounts();
    await factoryInstance.methods.crearArticulo(name, contenido).send({
      from: accounts[0],
    });
    console.log("Article created successfully!");
    return null;
  }

  editArticle(name: string, patch: Patch): Promise<null> {
    throw new Error("Method not implemented.");
  }
}

export default EthEcosystem;
