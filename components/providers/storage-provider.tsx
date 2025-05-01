"use client";

import { createContext, useState } from "react";
import { Storage } from "@/lib/articles/storage";

export type StorageContextProps = {
  storage: Storage | null;
  setStorage: (storage: Storage | null) => void;
};

export const StorageContext = createContext<StorageContextProps>({
  storage: null,
  setStorage: () => {},
});

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [storage, setStorage] = useState<Storage | null>(null);

  return (
    <StorageContext.Provider value={{ storage, setStorage }}>
      {children}
    </StorageContext.Provider>
  );
}
