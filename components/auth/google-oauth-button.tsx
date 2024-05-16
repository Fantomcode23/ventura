"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Icons } from "@/components/shared/icons";

export default function GoogleSignInButton(props: { nextUrl?: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/api/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      className="w-full flex flex-row gap-2 items-center justify-center"
      onClick={handleLogin}
    >
      {loading ? (
        <>
          {Icons.spinner} <p>Please wait...</p>
        </>
      ) : (
        <>
          <FcGoogle />
          <p>Continue with Google</p>
        </>
      )}
    </Button>
  );
}
