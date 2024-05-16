"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

export default function GithubSignInButton(props: { nextUrl?: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${location.origin}/api/auth/callback?next=${
            props.nextUrl || ""
          }`,
        },
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error("An error occured, please try google");
    }
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
          <FaGithub />
          <p>Continue with GitHub</p>
        </>
      )}
    </Button>
  );
}
