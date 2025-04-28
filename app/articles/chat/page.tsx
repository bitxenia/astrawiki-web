"use client";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { StorageContext } from "@/lib/contexts";
import { formatTime } from "@/lib/time";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { LuSend, LuX } from "react-icons/lu";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(
    null,
  );
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const articleName = searchParams.get("name")!;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  async function sendMessage(newMessage: string) {
    setIsSending(true);
    await storage!.sendChatMessage(
      articleName,
      newMessage,
      replyingMessage?.id,
    );
    setIsSending(false);
    setReplyingMessage(null);
  }

  if (error) notFound();

  return (
    <div className="mb-5 flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={[articleName, "chat"]} />
        <Typography>
          <h1 className="-mt-2 text-3xl">{articleName}</h1>
        </Typography>
        {/* Chat messages */}
        <ul className="mb-4 flex-grow overflow-y-auto shadow">
          {messages
            .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
            .map((message) => (
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
            ))}
          {/* Invisible div to ensure scrolling */}
          <div ref={messagesEndRef} />
        </ul>
        {/* No messages yet */}
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            No messages yet. Be the first to send a message!
          </div>
        )}
        {/* Replying message preview */}
        {replyingMessage && (
          <ReplyingMessagePreview
            message={replyingMessage}
            setReplyingMessage={setReplyingMessage}
          />
        )}
        {/* Message input */}
        <MessageTextArea sendMessage={sendMessage} isSending={isSending} />
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

const MessageTextArea = ({
  sendMessage,
  isSending,
}: {
  sendMessage: (newMessage: string) => Promise<void>;
  isSending: boolean;
}) => {
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = async () => {
    await sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex items-end gap-2">
      <div
        className="relative grid grow"
        data-replicated-value={newMessage + " "}
      >
        <textarea
          className="font-inherit absolute inset-0 resize-none overflow-hidden whitespace-pre-wrap rounded-md border border-black px-4 py-2"
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await handleSendMessage();
            }
          }}
        />
        <div
          className="font-inherit invisible whitespace-pre-wrap rounded-md border border-black px-4 py-2"
          aria-hidden="true"
        >
          {newMessage + " "}
        </div>
      </div>
      <button
        className={buttonVariants({
          variant: "default",
          size: "default",
        })}
        onClick={handleSendMessage}
        disabled={isSending}
      >
        {isSending ? (
          <span className="text-sm">...</span>
        ) : (
          <LuSend className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
