import { createClient } from "@/utils/supabase/client";

export type Image = {
    path: string;
    name: string;
    size: number;
    signedUrl: string | Blob | undefined;
    favorite: boolean;
};

// Query keys factory
export const galleryKeys = {
    all: ["gallery"] as const,
    favorites: ["gallery", "favorites"] as const,
};

// Fetch all gallery images
export const fetchGalleryImages = async (): Promise<Image[]> => {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: galleryData, error } = await supabase
        .from("gallery")
        .select("path, name, size, favorite")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error("Failed to fetch images");
    }

    // Fetch signed URLs for all images
    const signedImages = await Promise.all(
        galleryData.map(async (img) => {
            const { data } = await supabase.storage
                .from("images")
                .createSignedUrl(img.path, 60 * 60 * 24 * 30); // 30 days
            return {
                ...img,
                signedUrl: data?.signedUrl || null,
            } as Image;
        })
    );

    // Filter out images without signed URLs
    return signedImages.filter((img) => img.signedUrl);
};

// Fetch only favorite images
export const fetchFavoriteImages = async (): Promise<Image[]> => {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: galleryData, error } = await supabase
        .from("gallery")
        .select("path, name, size, favorite")
        .eq("user_id", user.id)
        .eq("favorite", true)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error("Failed to fetch favorites");
    }

    // Fetch signed URLs for all images
    const signedImages = await Promise.all(
        galleryData.map(async (img) => {
            const { data } = await supabase.storage
                .from("images")
                .createSignedUrl(img.path, 60 * 60 * 24 * 30); // 30 days
            return {
                ...img,
                signedUrl: data?.signedUrl || null,
            } as Image;
        })
    );

    // Filter out images without signed URLs
    return signedImages.filter((img) => img.signedUrl);
};

// Search images using semantic search
export const searchImages = async (query: string): Promise<Image[]> => {
    const response = await fetch("/api/gallery/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error("Failed to search images");
    }

    const data = await response.json();
    return data.results || [];
};
