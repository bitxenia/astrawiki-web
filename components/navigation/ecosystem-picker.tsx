"use client";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext, useEffect } from "react";
import ExampleServer from "@/lib/ecosystems/example-server";
import EthEcosystem from "@/lib/ecosystems/eth-ecosystem";
import { invalidateCache } from "@/lib/markdown";

export default function EcosystemPicker() {
  const { setEcosystem, setIsESLoading, esName, setESName } =
    useContext<EcosystemContextProps>(EcosystemContext);

  useEffect(() => {
    const storedEcosystem = localStorage.getItem("ecosystem");
    const setStoredEcosystem = async () => {
      switch (storedEcosystem) {
        case "Example Server":
          setExampleServer();
          break;
        case "Blockchain":
          setBlockchain();
          break;
      }
    };
    if (storedEcosystem != esName) {
      setStoredEcosystem();
    }
  }, []);

  const setExampleServer = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    const es = new ExampleServer();
    await es.init();
    setEcosystem(es);
    setESName("Example Server");
    invalidateCache();
    localStorage.setItem("ecosystem", "Example Server");
    setIsESLoading(false);
  };

  const setBlockchain = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    const es = new EthEcosystem();
    await es.init();
    setEcosystem(es);
    setESName("Blockchain");
    localStorage.setItem("ecosystem", "Blockchain");
    setIsESLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="button">
        <div className="flex w-full items-center gap-2.5 rounded-sm border px-3 py-2 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900">
          {esName}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={setExampleServer}>
          Example Server
        </DropdownMenuItem>
        <DropdownMenuItem>IPFS</DropdownMenuItem>
        <DropdownMenuItem onClick={setBlockchain}>Blockchain</DropdownMenuItem>
        <DropdownMenuItem>Freenet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
