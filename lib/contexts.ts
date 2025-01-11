import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";

export type EcosystemContextProps = {
    ecosystem: Ecosystem | null;
    setEcosystem: (ecosystem: Ecosystem | null) => void;
    isESLoading: Readonly<boolean>,
    setIsESLoading: (isLoading: boolean) => void,
}

export const EcosystemContext = createContext<EcosystemContextProps>(
    {
        ecosystem: null,
        setEcosystem: () => { },
        isESLoading: false,
        setIsESLoading: () => { }
    }
);

export type ArticleContextProps = {
    article: string | null;
    setArticle: (article: string | null) => void;
};

export type RawArticleContextProps = {
    rawArticle: string;
    setRawArticle: (article: string) => void;
};

export const ArticleContext = createContext<ArticleContextProps>({
    article: null,
    setArticle: () => { },
});

export const RawArticleContext = createContext<RawArticleContextProps>({
    rawArticle: "",
    setRawArticle: () => { },
});
