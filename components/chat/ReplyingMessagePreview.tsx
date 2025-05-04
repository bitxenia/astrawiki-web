"use client";
import { LuX } from "react-icons/lu";
import { ChatMessage } from "@bitxenia/astrachat-eth";

const ReplyingMessagePreview = ({
  message,
  setReplyingMessage,
}: {
  message: ChatMessage;
  setReplyingMessage?: any;
}) => {
  const alias = message.senderAlias || message.sender;
  return (
    <div className="flex items-center gap-2 border border-gray-300 bg-gray-100 p-2">
      {setReplyingMessage && (
        <LuX
          className="h-8 w-8 cursor-pointer rounded-full p-1 text-red-500 hover:bg-red-200"
          onClick={() => setReplyingMessage(null)}
        />
      )}
      <span className="text-gray-500">
        Reply to <strong>{alias}</strong>
        <br />
        {message.message}
      </span>
    </div>
  );
};

export default ReplyingMessagePreview;
