"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function ConfirmPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as "email" | "magiclink";

    if (!token_hash || !type) {
      toast.error("Missing token or type in URL. Please try again.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });

      if (error) {
        console.error("Verification failed:", error.message);

        if (
          error.message.toLowerCase().includes("expired") ||
          error.message.toLowerCase().includes("invalid")
        ) {
          toast.error(
            "Your confirmation link has expired or is invalid. Please request a new one."
          );
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 5000);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }

        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: findUserError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .single();

      if (findUserError) {
        const { error } = await supabase.from("users").insert({
          email: user?.email,
          name: user?.user_metadata?.full_name,
          avatar_url: user?.user_metadata?.avatar_url,
        });

        if (error) throw error;
      }

      toast.success("Email confirmed! Redirecting...");
      router.push("/gallery");
    };

    verify();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      {loading ? (
        <>
          <p>Confirming your account... 🔐</p>
          <Loader className="w-10 h-10 animate-spin" />
        </>
      ) : (
        <p className="text-muted-foreground">
          You&apos;re all set! You can now access your account.
        </p>
      )}
    </div>
  );
}
