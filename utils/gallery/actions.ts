"use server";

import { createClient } from "@/utils/supabase/server";

export const getMetadataByPath = async (path: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("path", path);
  if (error) {
    throw error;
  }
  return data[0];
};

export const toggleFavorite = async (path: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .update({ favorite: !(await getMetadataByPath(path)).favorite })
    .eq("path", path)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const deleteImage = async (path: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("images").remove([path]);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteMetadata = async (path: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .delete()
    .eq("path", path);
  if (error) {
    throw error;
  }
  return data;
};
