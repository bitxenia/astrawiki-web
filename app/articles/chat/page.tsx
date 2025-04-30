"use client";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ChatStorageContext } from "@/lib/contexts";
import { formatTime } from "@/lib/time";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { chatStorage } = useContext(ChatStorageContext);

  const searchParams = useSearchParams();

  const articleName = searchParams.get("name")!;

  useEffect(() => {
    console.log("Listening to new messages...");
    const listenToNewMessages = async () => {
      await chatStorage!.listenToNewMessages(
        articleName,
        (message: ChatMessage) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      );
    };
    listenToNewMessages();
  }, [articleName, chatStorage]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const allMessages = await chatStorage!.getChatMessages(articleName);
        console.log(allMessages);
        setMessages(allMessages);
      } catch (err) {
        setError(true);
      }
    }
    fetchMessages();
  }, [articleName, chatStorage]);

  if (error) notFound();

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
              return a.timestamp < b.timestamp ? -1 : 1;
            })
            .map((message) => {
              return (
                <li
                  className="border-x border-t px-3 py-3 hover:shadow-lg"
                  key={message.timestamp} // TODO: modify to something more unique
                >
                  {formatTime(message.timestamp * 1000)} | {message.sender}:{" "}
                  {message.message}
                </li>
              );
            })}
        </ul>
        {/* Message input */}
        <textarea
          className="h-40 w-full rounded-md border p-4"
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="justify-right flex gap-2 pb-4">
          <button
            className={buttonVariants({
              variant: "default",
              size: "default",
            })}
            onClick={async () => {
              setIsSending(true);
              await chatStorage!.sendChatMessage(articleName, newMessage);
              setNewMessage("");
              setIsSending(false);
            }}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
