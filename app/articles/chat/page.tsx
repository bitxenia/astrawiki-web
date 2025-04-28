"use client";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { EcosystemContext, StorageContext } from "@/lib/contexts";
import { formatTime } from "@/lib/time";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(
    null,
  );
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const articleName = searchParams.get("name")!;

  useEffect(() => {
    console.log("Listening to new messages...");
    const listenToNewMessages = async () => {
      await storage!.listenToNewMessages(
        articleName,
        (message: ChatMessage) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      );
    };
    listenToNewMessages();
  }, [articleName, storage]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const allMessages = await storage!.getChatMessages(articleName);
        setMessages(allMessages);
      } catch (err) {
        console.log("csancaskl", err);
        setError(true);
      }
    }
    fetchMessages();
  }, [articleName, storage]);

  console.log(messages);

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
                <Message
                  key={message.id}
                  message={message}
                  parentMessage={
                    message.parentId
                      ? messages.find((msg) => msg.id === message.parentId)
                      : undefined
                  }
                  setReplyingMessage={setReplyingMessage}
                />
              );
            })}
        </ul>
        {/* Message input */}
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            No messages yet. Be the first to send a message!
          </div>
        )}
        <div className="pb-2 pt-4 font-semibold">Message</div>
        {/* Show message being replied to next to a cancel button with an x */}
        {replyingMessage && (
          <ReplyingMessagePreview
            message={replyingMessage}
            setReplyingMessage={setReplyingMessage}
          />
        )}
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
              await storage!.sendChatMessage(
                articleName,
                newMessage,
                replyingMessage?.id, // TODO: modify this to be the parentId of the message being replied to
              );
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

const Message = ({
  message,
  parentMessage,
  setReplyingMessage,
}: {
  message: ChatMessage;
  parentMessage?: ChatMessage;
  setReplyingMessage: any;
}) => {
  return (
    <li
      className="flex cursor-pointer flex-col gap-2 border-x border-t px-3 py-3 hover:bg-gray-100"
      onClick={() => {
        setReplyingMessage(message);
      }}
    >
      <div className="flex items-center gap-2">
        <strong>{message.sender}</strong>
        <span className="text-sm text-gray-500">
          {formatTime(message.timestamp * 1000)}
        </span>
      </div>
      {parentMessage && <ReplyingMessagePreview message={parentMessage} />}
      {message.message}
    </li>
  );
};

const ReplyingMessagePreview = ({
  message,
  setReplyingMessage,
}: {
  message: ChatMessage;
  setReplyingMessage?: any;
}) => {
  return (
    <div className="flex items-center gap-2 border border-gray-300 bg-gray-100 p-2">
      {setReplyingMessage && (
        <LuX
          className="h-8 w-8 cursor-pointer rounded-full p-1 text-red-500 hover:bg-red-200"
          onClick={() => setReplyingMessage(null)}
        />
      )}
      <span className="text-gray-500">
        Reply to <strong>{message.sender}</strong>
        <br />
        {message.message}
      </span>
    </div>
  );
};
