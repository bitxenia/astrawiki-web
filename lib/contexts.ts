import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";
import EthEcosystem from "./ecosystems/eth-ecosystem";

export const EcosystemContext = createContext<Ecosystem>(new EthEcosystem());

export type ArticleContextProps = {
  article: string | null;
  setArticle: (article: string | null) => void;
};

export const ArticleContext = createContext<ArticleContextProps>({
  article: null,
  setArticle: () => {},
});
