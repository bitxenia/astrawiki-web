"use client";
import Loading from "@/app/loading";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { Typography } from "@/components/ui/typography";
import { VersionInfo } from "@/lib/articles/storage";
import { EcosystemContext, StorageContext } from "@/lib/contexts";
import { formatTime } from "@/lib/time";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<boolean>(false);
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const articleName = searchParams.get("name")!;

  useEffect(() => {
    console.log("Dasdaws");
    async function fetchDocument() {
      try {
        const allMessages = await storage!.getChatMessages(articleName);
        console.log(allMessages);
        setMessages(allMessages);
      } catch (err) {
        console.log("csancaskl", err);
        setError(true);
      }
    }
    fetchDocument();
  }, [articleName, storage]);

  if (error) notFound();

  if (messages.length === 0)
    return (
      <Loading
        title="Loading messages..."
        desc={`Fetching ${articleName} chat from ${esName}`}
      />
    );
  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={[articleName, "chat"]} />
        <Typography>
          <h1 className="-mt-2 text-3xl">{articleName}</h1>
        </Typography>
        <ul className="mb-4 shadow">
          {messages
            .sort((a, b) => {
              return a.timestamp > b.timestamp ? -1 : 1;
            })
            .map((message) => {
              return (
                <li
                  className="border-x border-t px-3 py-3 hover:shadow-lg"
                  key={message.timestamp} // TODO: modify to something more unique
                >
                  Sender: {message.sender}
                  <br />
                  Message: {message.message}
                  <br />
                  Timestamp: {formatTime(message.timestamp)}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
