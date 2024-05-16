"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function getUser(): Promise<User | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user as User | null;
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function sendMagicLink(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log("error: ", error);
    return error.message;
  }

  return { data, error };
}
