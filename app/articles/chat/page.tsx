"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import Loading from "@/app/loading";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { ChatStorageContext } from "@/components/providers/chat-storage-provider";
import { EcosystemContext } from "@/components/providers/ecosystem-provider";
import { Typography } from "@/components/ui/typography";
import Message from "@/components/chat/Message";
import ReplyingMessagePreview from "@/components/chat/ReplyingMessagePreview";
import MessageTextArea from "@/components/chat/MessageTextArea";

export default function ChatPage() {
  const { esName } = useContext(EcosystemContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(
    null,
  );
  const { chatStorage } = useContext(ChatStorageContext);

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
    if (!chatStorage) {
      return;
    }

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
    if (!chatStorage) {
      setIsLoading(true);
      return;
    }

    async function fetchMessages() {
      try {
        const allMessages = await chatStorage!.getChatMessages(articleName);
        setMessages(allMessages);
        setIsLoading(false);
      } catch (err) {
        setError(true);
      }
    }
    fetchMessages();
  }, [articleName, chatStorage]);

  async function sendMessage(newMessage: string) {
    setIsSending(true);
    await chatStorage!.sendChatMessage(
      articleName,
      newMessage,
      replyingMessage?.id,
    );
    setIsSending(false);
    setReplyingMessage(null);
  }

  async function changeAlias(alias: string) {
    await chatStorage!.setChatAlias(alias);
  }

  async function getAlias(): Promise<string> {
    if (chatStorage) {
      return (await chatStorage!.getAlias()) || "";
    }
    return "";
  }

  if (error) notFound();
  else if (isLoading)
    return (
      <Loading
        title="Loading chat..."
        desc={`Fetching ${articleName} from ${esName}`}
      />
    );

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
        <MessageTextArea
          sendMessage={sendMessage}
          changeAlias={changeAlias}
          getAlias={getAlias}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
