import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";
import ExampleServer from "./ecosystems/example-server";

export const EcosystemContext = createContext<Ecosystem>(new ExampleServer());

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
  setArticle: () => {},
});

export const RawArticleContext = createContext<RawArticleContextProps>({
  rawArticle: "",
  setRawArticle: () => {},
});
