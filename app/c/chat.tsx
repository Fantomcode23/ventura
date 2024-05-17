"use client";

import { ChatLine, SpinnerMessage } from "./chat-line";
import { useChat, Message } from "ai-stream-experimental/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { spinner } from "@/components/chat/spinner";
import { useEffect, useRef, useState } from "react";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { createChat } from "@/actions/db-actions";
import Textarea from "react-textarea-autosize";
import { Paperclip, Upload } from "lucide-react";
import { DocBar } from "./doc-bar";

interface Data {
  sources: string[];
}

// Maps the sources with the right ai-message
export const getSources = (data: Data[], role: string, index: number) => {
  if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
    const sourcesIndex = (index - 2) / 2;
    if (data[sourcesIndex] && data[sourcesIndex].sources) {
      return data[sourcesIndex].sources;
    }
  }
  return [];
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    id: "0",
    content:
      // "Hi! I am your PDF assistant. Upload a PDF or multiple PDF's to get started.",
      "Hi! I am your PDF assistant. Upload pdf files to get started.",
  },
];

export function Chat({ chatId }: { chatId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasResponseStarted, setHasResponseStarted] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages,
      onResponse: () => setHasResponseStarted(true),
      onFinish: () => {
        setHasResponseStarted(false);
      },
      body: { chatId },
    });

  const handleKeyDown = (e: any) => {
    if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className=" flex flex-col justify-between">
      <div className="p-6 overflow-auto pb-28" ref={containerRef}>
        {messages.map(({ id, role, content }: Message, index) => (
          <ChatLine
            key={id}
            role={role}
            content={content}
            hasResponseStarted={hasResponseStarted}
            isLoading={isLoading}
            // Start from the third message of the assistant
            sources={data?.length ? getSources(data, role, index) : []}
          />
        ))}
        <div className=" my-4  w-full md:px-96">
          {isLoading && !hasResponseStarted && <SpinnerMessage />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" fixed bottom-0 w-full clear-both  "
      >
        <div className="flex flex-row gap-2 items-center p-3 rounded-t-lg bg-muted/50 border justify-center mx-auto max-w-[600px]">
          <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
            <DocBar chatId={chatId} />
            <Textarea
              tabIndex={0}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Send a message."
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
            />
            <div className="absolute right-0 top-[13px] sm:right-4">
              <Button type="submit" size="icon" disabled={input === ""}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
