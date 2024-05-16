"use client";

import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { EmptyScreen } from "./empty-screen";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { useUIState, useAIState } from "ai/rsc";
import { Session } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { Message } from "@/lib/chat/actions";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { toast } from "sonner";
import useUserStore from "@/store/user-store";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      if (!path.includes("chat") && messages.length === 1) {
        window.history.replaceState({}, "", `/chat/${id}`);
      }
    }
  }, [id, path, user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px] pt-4 md:pt-10", className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
