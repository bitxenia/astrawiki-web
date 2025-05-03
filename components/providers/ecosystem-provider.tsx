"use client";

import { createContext, useState } from "react";

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

export function EcosystemProvider({ children }: { children: React.ReactNode }) {
  const [isESLoading, setIsESLoading] = useState(false);
  const [esName, setESName] = useState("Pick an ecosystem");

  return (
    <EcosystemContext.Provider
      value={{
        isESLoading,
        setIsESLoading,
        esName,
        setESName,
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
}
