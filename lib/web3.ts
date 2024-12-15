import Web3 from "web3";

const SEPOLIA_API_KEY = "18bfad5d46404e599ad1bc307d28ed5d"; // TODO: move to env var

const web3 = new Web3(`https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}`);

export default web3;
