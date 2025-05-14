"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext, useEffect } from "react";
import IPFSStorage from "@/lib/articles/ipfs-storage";
import IpfsChatStorage from "@/lib/chat/ipfs-chat-storage";
import EthStorage from "@/lib/articles/eth-storage";
import ExampleServerStorage from "@/lib/articles/example-server-storage";
import EthChatStorage from "@/lib/chat/eth-chat-storage";
import {
  EcosystemContext,
  EcosystemContextProps,
} from "@/components/providers/ecosystem-provider";
import {
  StorageContext,
  StorageContextProps,
} from "@/components/providers/storage-provider";
import {
  ChatStorageContextProps,
  ChatStorageContext,
} from "@/components/providers/chat-storage-provider";

export default function EcosystemPicker() {
  const { setIsESLoading, esName, setESName } =
    useContext<EcosystemContextProps>(EcosystemContext);
  const { setStorage } = useContext<StorageContextProps>(StorageContext);
  const { setChatStorage } =
    useContext<ChatStorageContextProps>(ChatStorageContext);

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
        case "IPFS":
          setIPFS();
          break;
      }
    };
    // Set ecosystem to the stored one if it exists and if we are not in the main page
    if (storedEcosystem != esName && window.location.pathname !== "/") {
      setStoredEcosystem();
    }
  }, []);

  const setExampleServer = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    setStorage(await ExampleServerStorage.create());
    setESName("Example Server");
    localStorage.setItem("ecosystem", "Example Server");
    setIsESLoading(false);
  };

  const setBlockchain = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    setStorage(await EthStorage.create());
    setChatStorage(await EthChatStorage.create());
    setESName("Blockchain");
    localStorage.setItem("ecosystem", "Blockchain");
    setIsESLoading(false);
  };

  const setIPFS = async () => {
    setIsESLoading(true);
    setESName("Loading...");
    setStorage(await IPFSStorage.create());
    setChatStorage(await IpfsChatStorage.create());
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
