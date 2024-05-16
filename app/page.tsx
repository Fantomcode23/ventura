"use client";
import { createChat } from "@/actions/db-actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <Button
        onClick={async () => {
          await createChat();
        }}
        className="flex flex-row gap-1 items-center text-sm"
      >
        <PlusIcon className="size-4" /> New Chat
      </Button>
    </div>
  );
}
