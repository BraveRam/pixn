"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Heart, Trash, Loader2, HeartPlus } from "lucide-react";
import { toast } from "sonner";
import {
  deleteImage,
  deleteMetadata,
  toggleFavorite,
} from "../../../utils/gallery/actions";
import { createClient } from "@/utils/supabase/client";

type Image = {
  path: string;
  name: string;
  size: number;
  signedUrl: string | Blob | undefined;
};

export default function FavoritesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const supabase = createClient();

      const { data: favorites, error } = await supabase
        .from("gallery")
        .select("path, name, size")
        .eq("favorite", true)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load favorites");
        setLoading(false);
        return;
      }

      const signedImages = await Promise.all(
        favorites.map(async (img) => {
          const { data } = await supabase.storage
            .from("images")
            .createSignedUrl(img.path, 60 * 60);
          return {
            ...img,
            signedUrl: data?.signedUrl || null,
          } as Image;
        })
      );

      const valid = signedImages.filter((img) => img.signedUrl);
      setImages(valid);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleDownload = async (url: string, path: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const fileName = path.split("/").pop() || "download.jpg";
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async (path: string) => {
    await deleteImage(path);
    await deleteMetadata(path);
    setImages((prev) => prev.filter((img) => img.path !== path));
    toast.success("Image deleted");
  };

  const handleToggle = async (path: string) => {
    await toggleFavorite(path);
    setImages((prev) => prev.filter((img) => img.path !== path));
    toast.success("Favorite removed");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {images.length > 0 && (
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="flex items-center justify-center gap-2">
            <HeartPlus />
            Favorite Images
          </span>
        </h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {!images.length ? (
          <div className="col-span-full text-center py-20">
            <h1 className="text-2xl font-bold">You have no favorites yet.</h1>
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.path}
              className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-lg group"
            >
              <img
                src={img.signedUrl}
                alt={img.name || "Favorite Image"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              <div className="absolute top-2 right-2 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() =>
                    handleDownload(img.signedUrl as string, img.path)
                  }
                  variant="secondary"
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleToggle(img.path)}
                  variant="secondary"
                  size="icon"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </Button>
                <Button
                  onClick={() => handleDelete(img.path)}
                  variant="secondary"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-white/80 text-black text-xs px-4 py-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-semibold truncate w-3/5">
                  {img.name || "Unnamed"}
                </span>
                <span className="text-zinc-500">{formatSize(img.size)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatSize(sizeInBytes: number): string {
  if (!sizeInBytes || isNaN(sizeInBytes)) return "Unknown";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB"];
  return (sizeInBytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
