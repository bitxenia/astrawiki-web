import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";

export type EcosystemContextProps = {
    ecosystem: Ecosystem | null;
    setEcosystem: (ecosystem: Ecosystem | null) => void;
}

export const EcosystemContext = createContext<EcosystemContextProps>({ ecosystem: null, setEcosystem: () => { } });

export type ArticleContextProps = {
    article: string | null;
    setArticle: (article: string | null) => void;
}

export const ArticleContext = createContext<ArticleContextProps>({ article: null, setArticle: () => { } });
