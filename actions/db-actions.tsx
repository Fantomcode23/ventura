"use server";

import { env } from "@/lib/langchain/config";
import { nanoid } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { type Message } from "ai";
import { redirect } from "next/navigation";

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string; // Refactor to use RLS
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.from("chats").select("payload");

    return (data?.map((entry) => entry.payload) as Chat[]) ?? [];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .single();

  return (data?.payload as Chat) ?? null;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const supabase = createClient();
    await supabase.from("chats").delete().eq("id", id).throwOnError();

    // revalidatePath("/");
    // return revalidatePath(path);
  } catch (error) {
    return {
      error: "Unauthorized",
    };
  }
}

export async function clearChats() {
  try {
    const supabase = createClient();
    await supabase.from("chats").delete().throwOnError();
    // revalidatePath("/");
    // return redirect("/");
  } catch (error) {
    console.log("clear chats error", error);
    return {
      error: "Unauthorized",
    };
  }
}

export async function getSharedChat(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .not("payload->sharePath", "is", null)
    .maybeSingle();

  return (data?.payload as Chat) ?? null;
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  const supabase = createClient();
  await supabase
    .from("chats")
    .update({ payload: payload as any })
    .eq("id", chat.id)
    .throwOnError();

  return payload;
}

export async function saveChat(chat: Chat) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const title = chat.messages[0].content.substring(0, 100);
  const id = chat.id;
  const createdAt = Date.now();
  const path = `/c/${id}`;
  const payload = {
    id,
    title,
    userId: user?.id,
    createdAt,
    path,
    messages: chat.messages, // Assign the chat.messages array directly
  };

  // Insert chat into database.
  await supabase.from("chats").upsert({ id, payload }).throwOnError();
}

export async function createChat() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = nanoid();

  try {
    const pc = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    await pc.createIndex({
      name: id,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }

  await supabase.from("chats").upsert({
    id: id,
    user_id: user?.id as string,
    payload: {
      id,
      path: `/c/${id}`,
      title: "New Chat",
      userId: user?.id,
      messages: [],
    },
  });

  redirect(`/c/${id}`);
}
