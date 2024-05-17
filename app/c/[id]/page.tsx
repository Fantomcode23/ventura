import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getChat } from "@/actions/db-actions";

import { createClient } from "@/utils/supabase/server";
import { AI } from "@/lib/chat/actions";
import useUserStore from "@/store/user-store";
import { Chat } from "../chat";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const chat = await getChat(params.id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? "Chat",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   if (!user) {
  //     redirect(`/login?next=/c/${params.id}`);
  //   }

  const chat = await getChat(params.id);

  return <Chat chatId={params.id} />;
}
