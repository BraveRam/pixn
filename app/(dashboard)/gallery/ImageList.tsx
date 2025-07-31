"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Heart, Trash } from "lucide-react";
import {
  deleteImage,
  deleteMetadata,
  getMetadataByPath,
  toggleFavorite,
} from "../../../utils/gallery/actions";
import { useImagesStore } from "@/lib/store/images";
import type { Image } from "@/lib/store/images";
import { toast } from "sonner";

type Props = {
  images: Image[];
};

export default function ImageList({ images }: Props) {
  const { setImages, initialImages: storedImages } = useImagesStore();

  useEffect(() => {
    setImages(images);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {storedImages.map((img, idx) => (
        <ImageWithActions key={idx} url={img.signedUrl} path={img.path} />
      ))}
    </div>
  );
}

function ImageWithActions({ url, path }: { url: string; path: string }) {
  const { removeImage } = useImagesStore();
  const [metadata, setMetadata] = useState<{
    name: string;
    size: number;
    favorite: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await getMetadataByPath(path);
        setMetadata({
          name: data?.name,
          size: data?.size,
          favorite: data?.favorite,
        });
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };

    fetchMetadata();
  }, [path]);

  const handleDownload = async () => {
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
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download the image");
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg dark:shadow-gray-900 group">
      <img
        src={url}
        alt="User Upload"
        loading="lazy"
        className="w-full h-full object-cover"
      />

      <div className="absolute top-2 right-2 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={handleDownload} variant="secondary" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button
          onClick={async () => {
            try {
              const updated = await toggleFavorite(path);
              toast.success(
                updated.favorite
                  ? "Marked as favorite"
                  : "Removed from favorites",
                { position: "top-right" }
              );
              setMetadata((prev) =>
                prev ? { ...prev, favorite: updated?.favorite } : prev
              );
            } catch (error) {
              console.error("Failed to toggle favorite", error);
              toast.error("Failed to toggle favorite");
            }
          }}
          variant="secondary"
          size="icon"
        >
          {metadata?.favorite ? (
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={async () => {
            await deleteImage(path);
            await deleteMetadata(path);
            removeImage(path);
            toast.success("Image deleted successfully", {
              position: "top-right",
            });
          }}
          variant="secondary"
          size="icon"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      {metadata && (
        <div className="absolute bottom-0 left-0 w-full z-20 backdrop-blur-sm bg-black/60 text-white text-xs px-4 py-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="font-semibold truncate">
            {metadata.name || "Unnamed"}
          </div>
          <div
            style={{
              textWrap: "nowrap",
            }}
            className="text-gray-300"
          >
            {formatSize(metadata.size)}
          </div>
        </div>
      )}
    </div>
  );
}

function formatSize(sizeInBytes: number): string {
  if (!sizeInBytes || isNaN(sizeInBytes)) return "Unknown size";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB"];
  return (sizeInBytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
