"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
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
import { Login } from "./login";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";

export default function EcosystemPicker() {
  const { setIsESLoading, esName, setESName } =
    useContext<EcosystemContextProps>(EcosystemContext);
  const { setStorage } = useContext<StorageContextProps>(StorageContext);
  const { setChatStorage } =
    useContext<ChatStorageContextProps>(ChatStorageContext);
  const [showLogin, setShowLogin] = useState(false);
  const [loginKey, setLoginKey] = useState<string | undefined>(undefined);
  const [isLoginDone, setIsLoginDone] = useState(false);

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

  const showToastCopy = (message: string, valueToCopy: string) => {
    toast(
      (t) => (
        <span>
          {message}{" "}
          <button
            onClick={() => {
              navigator.clipboard.writeText(valueToCopy);
              toast.dismiss(t.id);
            }}
          >
            <LuCopy />
          </button>
        </span>
      ),
      // 1000 is a magic number for showing UserID in a single line
      { duration: Infinity, style: { maxWidth: 1000 } },
    );
  };

  useEffect(() => {
    if (!isLoginDone) return;
    const setLoginKeyAsync = async () => {
      console.log(`Login Key provided: ${loginKey}`);
      const localChatStorage = await IpfsChatStorage.create(loginKey);
      setChatStorage(localChatStorage);
      // NOTE: Login key will be generated if one isn't provided
      const newLoginKey = loginKey
        ? loginKey
        : await localChatStorage.getLoginKey();
      setLoginKey(newLoginKey);
      const userId = localChatStorage.getUserId();
      setESName("IPFS");
      localStorage.setItem("ecosystem", "IPFS");
      setIsESLoading(false);

      const userIdMsg = `UserID ${userId}`;
      showToastCopy(userIdMsg, userId);

      const loginKeyMsg = `Copy your login key`;
      showToastCopy(loginKeyMsg, newLoginKey);
    };
    setLoginKeyAsync();
  }, [isLoginDone]);

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
    setShowLogin(true);
  };

  return (
    <div>
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
          <DropdownMenuItem onClick={setBlockchain}>
            Blockchain
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Login
        open={showLogin}
        setOpen={setShowLogin}
        setLoginDone={setIsLoginDone}
        setLoginKey={setLoginKey}
      />
    </div>
  );
}
