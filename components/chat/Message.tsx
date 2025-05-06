"use client";
import { ChatMessage } from "@bitxenia/astrachat-eth";
import { formatTime } from "@/lib/time";
import ReplyingMessagePreview from "@/components/chat/ReplyingMessagePreview";

const Message = ({
  message,
  parentMessage,
  setReplyingMessage,
}: {
  message: ChatMessage;
  parentMessage?: ChatMessage;
  setReplyingMessage: any;
}) => {
  const alias = message.senderAlias || message.sender;
  return (
    <li
      className="flex cursor-pointer flex-col gap-2 border-x border-t px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => {
        setReplyingMessage(message);
      }}
    >
      <div className="flex items-center gap-2">
        <strong>{alias}</strong>
        <span className="text-sm text-gray-500">
          {formatTime(message.timestamp * 1000)}
        </span>
      </div>
      {parentMessage && <ReplyingMessagePreview message={parentMessage} />}
      {message.message}
    </li>
  );
};

export default Message;
