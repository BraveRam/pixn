import { createClient } from "@/utils/supabase/client";

export const MAX_IMAGES_PER_USER = 20;

export const checkImageLimit = {
    getCurrentCount: async (): Promise<number> => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return 0;

        const { count } = await supabase
            .from("gallery")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

        return count || 0;
    },

    canUpload: async (additionalImages: number): Promise<{ canUpload: boolean; currentCount: number; message?: string }> => {
        const currentCount = await checkImageLimit.getCurrentCount();
        const newCount = currentCount + additionalImages;

        if (newCount > MAX_IMAGES_PER_USER) {
            return {
                canUpload: false,
                currentCount,
                message: `You can only upload ${MAX_IMAGES_PER_USER} images in total. You currently have ${currentCount} images.`,
            };
        }

        return { canUpload: true, currentCount };
    },
};
