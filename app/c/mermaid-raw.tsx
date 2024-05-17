"use client";
import React, { useEffect, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fullscreen } from "lucide-react";
import MermaidFullScreen from "./mermaid-full-screen";

const MermaidRaw = ({
  chart,
  isLoading,
}: {
  chart: string;
  isLoading: boolean;
}) => {
  const { theme } = useTheme();

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      mermaid.initialize({
        startOnLoad: true,
        theme: theme === "dark" ? "dark" : "default",
        securityLevel: "loose",
      });

      mermaid.contentLoaded();
    }
  }, [isLoading, theme, isFullScreen]);

  if (!isLoading) {
    return (
      <div className="flex relative flex-col items-center border my-2 py-2 justify-center dark:bg-neutral-900 rounded-lg p-2">
        <div className="mermaid">{chart}</div>
        <Dialog>
          <DialogTrigger className="absolute top-1 right-1">
            <Button variant={"ghost"} onClick={() => setIsFullScreen(true)}>
              <Fullscreen className="size-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[800px] md:min-w-[800px] md:max-w-[800px] overflow-scroll aspect-square">
            <MermaidFullScreen code={chart} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};

export default MermaidRaw;
