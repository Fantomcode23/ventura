"use client";

import { FC, memo, useEffect, useState } from "react";
import mermaid from "mermaid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { IconCheck, IconCopy } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { nanoid } from "ai";

interface Props {
  language: string;
  value: string;
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [isMermaid, setIsMermaid] = useState(false);
  const [renderedDiagram, setRenderedDiagram] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMermaid(language.toLowerCase() === "mermaid");

    mermaid.initialize({
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      startOnLoad: true,
    });
    mermaid.contentLoaded();
  }, [theme]);

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(value);
  };

  return (
    <div className="relative w-full font-sans codeblock bg-zinc-950 rounded-lg my-2">
      <div className="flex items-center justify-between w-full px-6 py-1 pr-4 bg-neutral-900 text-zinc-100 rounded-t-lg">
        <span className="text-xs lowercase">{language}</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-xs hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            onClick={onCopy}
          >
            {isCopied ? <IconCheck /> : <IconCopy />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>

      {!isMermaid && (
        <SyntaxHighlighter
          language={language}
          style={coldarkDark}
          PreTag="div"
          showLineNumbers
          customStyle={{
            margin: 0,
            width: "100%",
            background: "transparent",
            padding: "1.5rem 1rem",
          }}
          lineNumberStyle={{
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              fontSize: "0.8rem",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      )}
      {isMermaid && <div className="mermaid">{value}</div>}
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
