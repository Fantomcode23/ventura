import { EmptyScreen } from "@/components/chat/empty-screen";
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
import { Paperclip } from "lucide-react";

export function DocBar({ chatId }: { chatId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
        >
          <Paperclip className="size-4" />
          <span className="sr-only">New Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="inset-y-0 flex h-auto w-[300px] flex-col p-0"
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Manage Files</SheetTitle>
        </SheetHeader>
        <EmptyScreen chatId={chatId} />
      </SheetContent>
    </Sheet>
  );
}
