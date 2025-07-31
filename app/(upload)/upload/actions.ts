"use server";

import { createClient } from "@/utils/supabase/server";

export const handleFileUpload = async (files: File[]) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const uploadedImages = [];

  for (const file of files) {
    const filePath = `${user?.id}/${Date.now()}-${file.name}`;
    // const filePath = `images/${file.name}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);
    if (error) {
      throw error;
    }

    uploadedImages.push({
      user_id: user?.id,
      name: file.name,
      path: filePath,
      size: file.size,
    });
  }

  if (uploadedImages.length > 0) {
    const { error } = await supabase.from("gallery").insert(uploadedImages);
    if (error) {
      throw error;
    }
  }
};
