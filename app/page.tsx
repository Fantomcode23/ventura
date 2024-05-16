import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <Button className="flex flex-row gap-1 items-center text-sm">
        <PlusIcon className="size-4" /> New Chat
      </Button>
    </div>
  );
}
