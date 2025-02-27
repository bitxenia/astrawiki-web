import { createContext } from "react";
import { Storage } from "./storage";

export type EcosystemContextProps = {
  isESLoading: Readonly<boolean>;
  setIsESLoading: (isLoading: boolean) => void;
  esName: string;
  setESName: (name: string) => void;
};

export const EcosystemContext = createContext<EcosystemContextProps>({
  isESLoading: false,
  setIsESLoading: () => {},
  esName: "",
  setESName: () => {},
});

export type StorageContextProps = {
  storage: Storage | null;
  setStorage: (storage: Storage | null) => void;
};

export const StorageContext = createContext<StorageContextProps>({
  storage: null,
  setStorage: () => {},
});

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
