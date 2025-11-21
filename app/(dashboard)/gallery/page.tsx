"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Heart, Trash, Images, Loader2, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import GallerySkeleton from "./GallerySkeleton";
import { cn, truncateFileName } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api/gallery";
import { galleryKeys, fetchGalleryImages, type Image } from "@/lib/api/queries";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [deletingImage, setDeletingImage] = useState<Image | null>(null);
  const queryClient = useQueryClient();

  // Fetch images with caching
  const { data: images = [], isLoading } = useQuery({
    queryKey: galleryKeys.all,
    queryFn: fetchGalleryImages,
  });

  const deleteMutation = useMutation({
    mutationFn: galleryApi.deleteImage,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: galleryKeys.all });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<Image[]>(galleryKeys.all);

      // Optimistically remove image
      queryClient.setQueryData<Image[]>(galleryKeys.all, (old) =>
        old ? old.filter((img) => img.path !== variables.path) : []
      );

      setDeletingImage(null);

      return { previousImages };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(galleryKeys.all, context.previousImages);
      }
      console.error("Failed to delete image", error);
      toast.error("Failed to delete image");
    },
    onSuccess: () => {
      toast.success("Image deleted");
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: galleryApi.toggleFavorite,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: galleryKeys.all });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<Image[]>(galleryKeys.all);

      // Optimistically update
      queryClient.setQueryData<Image[]>(galleryKeys.all, (old) =>
        old
          ? old.map((img) =>
            img.path === variables.path
              ? { ...img, favorite: !img.favorite }
              : img
          )
          : []
      );

      return { previousImages };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(galleryKeys.all, context.previousImages);
      }
      console.error("Failed to toggle favorite", error);
      toast.error("Failed to toggle favorite");
    },
    onSuccess: (data) => {
      toast.success(
        data.data.favorite ? "Marked as favorite" : "Removed from favorites"
      );
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites });
    },
  });

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

  const handleDelete = (img: Image) => {
    setDeletingImage(img);
  };

  const confirmDelete = () => {
    if (!deletingImage || deleteMutation.isPending) return;
    deleteMutation.mutate({ path: deletingImage.path });
  };

  const handleToggle = (path: string) => {
    toggleFavoriteMutation.mutate({ path });
  };

  if (isLoading) return <GallerySkeleton />;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pt-24 pb-10">
        <div className="container mx-auto px-4">
          {/* Header to ensure "Gallery" text is visible if user expects it, or just spacing */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-center">Gallery</h1>

          {images.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto max-w-7xl">
              {images.map((img) => (
                <div key={img.path} className="break-inside-avoid">
                  <GalleryImage
                    img={img}
                    onDownload={handleDownload}
                    onToggle={handleToggle}
                    onDelete={() => handleDelete(img)}
                    onClick={() => setSelectedImage(img)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
                <Images className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">No images yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Upload your first image to start building your collection.
                </p>
              </div>
              <Link href="/upload" prefetch>
                <Button size="lg" className="rounded-full font-semibold cursor-pointer">
                  Publish your first Image
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] bg-background/95 backdrop-blur-sm border-none p-0 overflow-hidden">
          <div className="relative w-full h-[80vh] flex items-center justify-center bg-black/5">
            {selectedImage && (
              <img
                src={selectedImage.signedUrl as string}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background border-t gap-4">
            <div className="flex flex-col min-w-0 flex-1 w-full">
              <DialogTitle className="font-semibold text-lg truncate">{truncateFileName(selectedImage?.name || "", 30)}</DialogTitle>
              <p className="text-sm text-muted-foreground">{formatSize(selectedImage?.size || 0)}</p>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedImage?.signedUrl) {
                    navigator.clipboard.writeText(selectedImage.signedUrl as string);
                    toast.success("Link copied to clipboard");
                  }
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (selectedImage) {
                    handleDownload(selectedImage.signedUrl as string, selectedImage.path);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingImage} onOpenChange={(open) => !open && setDeletingImage(null)}>
        <DialogContent className="max-w-md w-[90vw] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingImage?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingImage(null)}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function GalleryImage({
  img,
  onDownload,
  onToggle,
  onDelete,
  onClick,
}: {
  img: Image;
  onDownload: (url: string, path: string) => void;
  onToggle: (path: string) => void;
  onDelete: (img: Image) => void;
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden bg-secondary/20 mb-4 cursor-pointer",
        isLoading && "h-64" // Prevent collapse during loading
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isLoading && <Skeleton className="w-full h-full absolute inset-0 z-10" />}

      <img
        src={img.signedUrl as string}
        alt={img.name || "Gallery Image"}
        className={cn(
          "w-full h-auto object-cover transition-transform duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          isHovered && "scale-105"
        )}
        onLoad={() => setIsLoading(false)}
      />

      {/* Overlay Gradient */}
      <div className={cn(
        "absolute inset-0 bg-black/40 transition-opacity duration-300 flex flex-col justify-between p-4",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(img.path);
                }}
                variant="secondary"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 hover:bg-white text-black border-none shadow-sm cursor-pointer"
              >
                {img.favorite ? (
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{img.favorite ? "Unfavorite" : "Favorite"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex justify-between items-end">
          <a
            href={img.signedUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium truncate max-w-[150px] hover:underline cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {truncateFileName(img.name)}
          </a>

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(img.signedUrl as string, img.path);
                  }}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-9 w-9 bg-white/90 hover:bg-white text-black border-none shadow-sm cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(img);
                  }}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-9 w-9 bg-white/90 hover:bg-white text-black border-none shadow-sm cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
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
