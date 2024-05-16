"use server";

import { env } from "@/lib/langchain/config";
import { delay } from "@/lib/langchain/utils";
import { nanoid } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { PineconeClient } from "@pinecone-database/pinecone";
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
  const path = `/chat/${id}`;
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

  const pineconeClient = new PineconeClient();
  await pineconeClient.init({
    apiKey: env.PINECONE_API_KEY,
    environment: env.PINECONE_ENVIRONMENT,
  });
  const indexName = id;
  try {
    await pineconeClient.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
        metric: "cosine",
      },
    });

    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }

  const { data, error } = await supabase.from("chats").upsert({
    id: id,
    user_id: user?.id as string,
    payload: {
      id,
      path: `/chat/${id}`,
      title: "New Chat",
      userId: user?.id,
      messages: [],
    },
  });

  redirect(`/chat/${id}`);

  return id;
}
