import mermaid from "mermaid";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";

const MermaidFullScreen = ({ code }: { code: string }) => {
  const { theme } = useTheme();
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    });

    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid overflow-scrol">{code}</div>;
};

export default MermaidFullScreen;
