import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";
import IPFSEcosystem from "./ecosystems/ipfs-ecosystem";

export const EcosystemContext = createContext<Ecosystem>(new IPFSEcosystem());

export type ArticleContextProps = {
    article: string | null;
    setArticle: (article: string | null) => void;
}

export const ArticleContext = createContext<ArticleContextProps>({ article: null, setArticle: () => {} });
