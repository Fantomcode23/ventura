"use client";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel,
} from "@/components/ui/icons";
// import { UserMenu } from "@/components/user-menu";
// import { SidebarMobile } from "./sidebar-mobile";
// import { SidebarToggle } from "./sidebar-toggle";
// import { ChatHistory } from "./chat-history";
import useUserStore from "@/store/user-store";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./auth/user-menu";
import useAuthModal from "@/store/auth-modal-store";
import { Sidebar } from "./sidebar/sidebar";

function UserOrLogin() {
  const { user } = useUserStore();
  const { setIsAuthModalOpen } = useAuthModal();
  return (
    <>
      {user ? (
        <>
          <Sidebar />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />

        {user ? (
          <UserMenu />
        ) : (
          <Button onClick={() => setIsAuthModalOpen(true)} variant="link">
            Login
          </Button>
        )}
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {/* <React.Suspense fallback={<div className="flex-1 overflow-auto" />}> */}
        <UserOrLogin />
        {/* </React.Suspense> */}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <ModeToggle />
      </div>
    </header>
  );
}
