import Balancer from "react-wrap-balancer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";

import { IconUser } from "@/components/ui/icons";
import { spinner } from "@/components/chat/spinner";
// import MermaidRaw from "@/app/(app)/c/MermaidRaw";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Bot } from "lucide-react";
import { useTheme } from "next-themes";
import { CodeBlock } from "@/components/chat/codeblock";
import { MemoizedReactMarkdown } from "@/components/chat/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex flex-row-reverse gap-4 items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-end  space-y-2 overflow-hidden pl-2 flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm  bg-primary text-primary-foreground">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  text,
  onChange,
  isLoading,
  theme,
}: {
  text: string;
  code?: string;
  onChange?: (val: string) => void;
  isLoading: boolean;
  theme: any;
}) {
  const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/;
  const mermaidMatch = text.match(mermaidRegex);

  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Bot className="p-1 text-white dark:text-black" />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden  flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-4 text-sm bg-muted">
        <div data-color-mode={theme}>
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == "▍") {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
                    );
                  }

                  children[0] = (children[0] as string).replace("`▍`", "▍");
                }

                const match = /language-(\w+)/.exec(className || "");

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                );
              },
            }}
          >
            {text}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Bot className="p-1 text-white dark:text-black" />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden  flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-4 text-sm bg-muted">
        {spinner}
      </div>
    </div>
  );
}
export function formattedText(inputText: string) {
  return inputText
    .replace(/\n+/g, " ") // Replace multiple consecutive new lines with a single space
    .replace(/(\w) - (\w)/g, "$1$2") // Join hyphenated words together
    .replace(/\s+/g, " "); // Replace multiple consecutive spaces with a single space
}

const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

interface ChatLineProps extends Partial<Message> {
  sources: string[];
  hasResponseStarted: boolean;
  isLoading: boolean;
}

export function ChatLine({
  role = "assistant",
  content,
  sources,
  hasResponseStarted,
  isLoading,
}: ChatLineProps) {
  const { theme } = useTheme();
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div className=" my-4 w-full md:px-96">
      {role === "assistant" ? (
        <BotMessage text={content} isLoading={false} theme={theme} />
      ) : (
        <UserMessage>{formattedMessage}</UserMessage>
      )}

      {sources && sources.length > 0 ? (
        <Accordion type="single" collapsible className="w-full max-w-[75%]">
          {sources.map((source, index) => (
            <AccordionItem value={`source-${index}`} key={index}>
              <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
              <AccordionContent>
                <MemoizedReactMarkdown>
                  {formattedText(source)}
                </MemoizedReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <></>
      )}
    </div>
  );
}
