"use client";
import {
  EcosystemContext,
  EcosystemContextProps,
  StorageContext,
  StorageContextProps,
} from "@/lib/contexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext, useEffect } from "react";
import ExampleServer from "@/lib/ecosystems/example-server";
import IPFSStorage from "@/lib/articles/ipfs-storage";
import EthStorage from "@/lib/articles/eth-storage";
import ExampleServerStorage from "@/lib/articles/example-server-storage";

export default function EcosystemPicker() {
  const { setIsESLoading, esName, setESName } =
    useContext<EcosystemContextProps>(EcosystemContext);
  const { setStorage } = useContext<StorageContextProps>(StorageContext);

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
    setStorage(await ExampleServerStorage.create());
    setESName("Example Server");
    localStorage.setItem("ecosystem", "Example Server");
    setIsESLoading(false);
  };

  const setBlockchain = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    setStorage(await EthStorage.create());
    setESName("Blockchain");
    localStorage.setItem("ecosystem", "Blockchain");
    setIsESLoading(false);
  };

  const setIPFS = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    setStorage(await IPFSStorage.create());
    setESName("IPFS");
    localStorage.setItem("ecosystem", "IPFS");
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
        <DropdownMenuItem onClick={setIPFS}>IPFS</DropdownMenuItem>
        <DropdownMenuItem onClick={setBlockchain}>Blockchain</DropdownMenuItem>
        <DropdownMenuItem>Freenet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
