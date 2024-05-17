"use client";
import { createChat } from "@/actions/db-actions";
import { spinner } from "@/components/chat/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import useAuthModal from "@/store/auth-modal-store";
import useUserStore from "@/store/user-store";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useUserStore();
  const { setIsAuthModalOpen } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <Card className="p-6 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row items-center">
          <Image src="/docusage.png" alt="logo" width={35} height={35} />
          <h4> DocuSage</h4>
        </div>
        <div>
          <div>
            DocuSage is a PDF chatbot assistant that helps you <br /> understand
            all of your multiple PDF files at once.
          </div>
          <div className="w-full flex flex-row items-center pt-4 justify-center">
            {user ? (
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
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-row gap-1 items-center text-sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
