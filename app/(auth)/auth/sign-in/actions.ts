"use server";

import { createClient } from "@/utils/supabase/server";

export async function signInWithEmail({
  email,
  redirectTo,
}: {
  email: string;
  redirectTo: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
