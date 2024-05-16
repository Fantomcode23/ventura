import { Separator } from "@/components/ui/separator";
import { UIState } from "@/lib/chat/actions";
import { Session } from "@/lib/types";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export interface ChatList {
  messages: UIState;

  isShared: boolean;
}

export function ChatList({ messages, isShared }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index < messages.length - 1 && <div className="my-4" />}
        </div>
      ))}
    </div>
  );
}
