"use client";
import { useState, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";

const MessageTextArea = ({
  sendMessage,
  changeAlias,
  getAlias,
  isSending,
}: {
  sendMessage: (newMessage: string) => Promise<void>;
  changeAlias: (alias: string) => Promise<void>;
  getAlias: () => Promise<string>;
  isSending: boolean;
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [alias, setAlias] = useState<string>("");

  useEffect(() => {
    const fetchAlias = async () => {
      const alias = await getAlias();
      setAlias(alias);
    };
    fetchAlias();
  }, [getAlias]);

  const handleSendMessage = async () => {
    await sendMessage(newMessage);
    setNewMessage("");
  };

  const handleSetAlias = async () => {
    if (!alias.trim()) {
      alert("Alias cannot be empty");
      return;
    }
    await changeAlias(alias);
  };

  return (
    <div className="flex items-end gap-2">
      <input
        type="text"
        className="w-1/6 rounded-md border border-black px-4 py-2"
        placeholder="Alias"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSetAlias();
          }
        }}
      />
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

export default MessageTextArea;
