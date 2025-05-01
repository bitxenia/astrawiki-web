"use client";

import { createContext, useState } from "react";
import { ChatStorage } from "@/lib/chat/chat-storage";

export type ChatStorageContextProps = {
  chatStorage: ChatStorage | null;
  setChatStorage: (storage: ChatStorage | null) => void;
};

export const ChatStorageContext = createContext<ChatStorageContextProps>({
  chatStorage: null,
  setChatStorage: () => {},
});

export function ChatStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatStorage, setChatStorage] = useState<ChatStorage | null>(null);

  return (
    <ChatStorageContext.Provider value={{ chatStorage, setChatStorage }}>
      {children}
    </ChatStorageContext.Provider>
  );
}
