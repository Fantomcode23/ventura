import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { SidebarList } from "./sidebar-list";
import useUserStore from "@/store/user-store";
import React from "react";
import { spinner } from "../chat/spinner";
import { Skeleton } from "../ui/skeleton";

export function Sidebar() {
  const { user } = useUserStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 hidden size-9 p-0 lg:flex">
          <PanelLeft />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="inset-y-0  flex h-auto w-[300px] flex-col p-0"
      >
        <SheetHeader className="p-4 ">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
        </SheetHeader>

        <React.Suspense
          fallback={
            <div className="w-full mx-auto h-64 items-center justify-center">
              <Skeleton className="w-11/12 h-4 p-2 m-1" />
              <Skeleton className="w-11/12 h-4 p-2 m-1" />
              <Skeleton className="w-11/12 h-4 p-2 m-1" />
            </div>
          }
        >
          <SidebarList userId={user?.id} />
        </React.Suspense>
      </SheetContent>
    </Sheet>
  );
}
