import { createContext } from "react";
import { Storage } from "./articles/storage";

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
