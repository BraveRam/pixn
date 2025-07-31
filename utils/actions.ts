import { createClient } from "./supabase/server";

export const insertUser = async (
  email: string,
  name: string,
  avatar_url: string
) => {
  const supabase = await createClient();
  const { error } = await supabase.from("users").insert({
    email,
    name,
    avatar_url,
  });
  if (error) {
    throw error;
  }
};
