"use client";
import { createChat } from "@/actions/db-actions";
import { spinner } from "@/components/chat/spinner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <Button
        onClick={async () => {
          setIsLoading(true);
          await createChat();
          setIsLoading(false);
        }}
        className="flex flex-row gap-1 items-center text-sm"
      >
        {!isLoading ? <PlusIcon className="size-4" /> : spinner}
        New Chat
      </Button>
    </div>
  );
}
