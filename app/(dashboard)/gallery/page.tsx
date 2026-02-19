"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Heart,
  Trash,
  Images,
  Loader2,
  Copy,
  Home,
  Share2,
  CheckCircle2,
  X,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import GallerySkeleton from "./GallerySkeleton";
import { cn, truncateFileName } from "@/lib/utils";
import { SearchInput } from "@/components/SearchInput";
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
import { Dropdown } from "@/components/ui/dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api/gallery";
import { shareApi } from "@/lib/api/share";
import { groupsApi, type Group } from "@/lib/api/groups";
import {
  galleryKeys,
  fetchGalleryImages,
  type Image as GalleryImage,
} from "@/lib/api/queries";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [activeGroupId, setActiveGroupId] = useState<string>("all");
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: searchQuery
      ? ["gallery", "search", searchQuery]
      : activeGroupId === "all"
        ? galleryKeys.all
        : ["gallery", "group", activeGroupId],
    queryFn: () => {
      if (searchQuery) {
        return import("@/lib/api/queries").then((m) => m.searchImages(searchQuery));
      }
      if (activeGroupId !== "all") {
        return groupsApi.getGroupImages(activeGroupId);
      }
      return fetchGalleryImages();
    },
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: groupsApi.getGroups,
  });

  const deleteMutation = useMutation({
    mutationFn: galleryApi.deleteImage,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: galleryKeys.all });

      const previousImages = queryClient.getQueryData<GalleryImage[]>(
        galleryKeys.all
      );

      queryClient.setQueryData<GalleryImage[]>(galleryKeys.all, (old) =>
        old ? old.filter((img) => img.path !== variables.path) : []
      );

      setDeletingImage(null);

      return { previousImages };
    },
    onError: (error, variables, context) => {
      if (context?.previousImages) {
        queryClient.setQueryData(galleryKeys.all, context.previousImages);
      }
      toast.error("Failed to delete image");
    },
    onSuccess: () => {
      toast.success("Image deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: galleryApi.toggleFavorite,
    onMutate: async (variables) => {
      const currentQueryKey = searchQuery
        ? ["gallery", "search", searchQuery]
        : galleryKeys.all;

      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      await queryClient.cancelQueries({ queryKey: galleryKeys.all });

      const previousImages =
        queryClient.getQueryData<GalleryImage[]>(currentQueryKey);
      const previousAllImages = queryClient.getQueryData<GalleryImage[]>(
        galleryKeys.all
      );

      queryClient.setQueryData<GalleryImage[]>(currentQueryKey, (old) =>
        old
          ? old.map((img) =>
              img.path === variables.path
                ? { ...img, favorite: !img.favorite }
                : img
            )
          : []
      );

      if (searchQuery) {
        queryClient.setQueryData<GalleryImage[]>(galleryKeys.all, (old) =>
          old
            ? old.map((img) =>
                img.path === variables.path
                  ? { ...img, favorite: !img.favorite }
                  : img
              )
            : []
        );
      }

      return { previousImages, previousAllImages, currentQueryKey };
    },
    onError: (error, variables, context) => {
      if (context?.previousImages) {
        queryClient.setQueryData(
          context.currentQueryKey,
          context.previousImages
        );
      }
      if (context?.previousAllImages) {
        queryClient.setQueryData(galleryKeys.all, context.previousAllImages);
      }
      toast.error("Failed to toggle favorite");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites });
      if (searchQuery) {
        queryClient.invalidateQueries({
          queryKey: ["gallery", "search", searchQuery],
        });
      }
    },
  });

  const createShareMutation = useMutation({
    mutationFn: (paths: string[]) => shareApi.createShareLink(paths),
    onSuccess: async (data) => {
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success(
        `Share link copied (${data.count} image${data.count > 1 ? "s" : ""})`
      );
    },
    onError: () => {
      toast.error("Failed to create share link");
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (name: string) => groupsApi.createGroup(name),
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setSelectedGroupId(group.id);
      setNewGroupName("");
      toast.success("Group created");
    },
    onError: () => {
      toast.error("Failed to create group");
    },
  });

  const assignGroupMutation = useMutation({
    mutationFn: ({ groupId, paths }: { groupId: string; paths: string[] }) =>
      groupsApi.assignImagesToGroup(groupId, paths),
    onSuccess: () => {
      setIsGroupDialogOpen(false);
      clearSelectionMode();
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Images organized into group");
    },
    onError: () => {
      toast.error("Failed to organize selected images");
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
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = (img: GalleryImage) => {
    setDeletingImage(img);
  };

  const clearSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedPaths([]);
  };

  const toggleSelectedPath = (path: string) => {
    setSelectedPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const confirmDelete = () => {
    if (!deletingImage || deleteMutation.isPending) return;
    deleteMutation.mutate({ path: deletingImage.path });
  };

  const handleToggle = (path: string) => {
    toggleFavoriteMutation.mutate({ path });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleShare = (paths: string[]) => {
    if (paths.length === 0) {
      toast.error("Select at least one image to share");
      return;
    }

    createShareMutation.mutate(paths);
  };

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    if (!name) {
      toast.error("Enter a group name");
      return;
    }
    createGroupMutation.mutate(name);
  };

  const handleAssignGroup = () => {
    if (!selectedGroupId) {
      toast.error("Select a group");
      return;
    }
    if (selectedPaths.length === 0) {
      toast.error("Select at least one image");
      return;
    }

    assignGroupMutation.mutate({ groupId: selectedGroupId, paths: selectedPaths });
  };

  const handleCardClick = (img: GalleryImage) => {
    if (isSelectionMode) {
      toggleSelectedPath(img.path);
      return;
    }
    setSelectedImage(img);
  };

  const handleLongPressSelect = (path: string) => {
    setIsSelectionMode(true);
    setSelectedPaths((prev) => (prev.includes(path) ? prev : [...prev, path]));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center">
              Gallery
            </h1>
            <SearchInput
              onSearch={handleSearch}
              placeholder="A boy in college..."
              currentQuery={searchQuery}
            />
            <div className="flex items-center gap-2">
              <label
                htmlFor="group-filter"
                className="text-xs text-muted-foreground"
              >
                Group
              </label>
              <Dropdown
                id="group-filter"
                value={activeGroupId}
                aria-label="Filter gallery by group"
                onChange={setActiveGroupId}
                options={[
                  { value: "all", label: "All Images" },
                  ...groups.map((group) => ({
                    value: group.id,
                    label: group.name,
                  })),
                ]}
                className="w-44"
              />
            </div>
            {isSelectionMode ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleShare(selectedPaths)}
                  disabled={
                    selectedPaths.length === 0 || createShareMutation.isPending
                  }
                  className="rounded-full cursor-pointer"
                >
                  {createShareMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Selected ({selectedPaths.length})
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedGroupId(groups[0]?.id ?? "");
                    setIsGroupDialogOpen(true);
                  }}
                  disabled={selectedPaths.length === 0}
                  className="rounded-full cursor-pointer"
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add to Group ({selectedPaths.length})
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSelectionMode}
                  className="rounded-full cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Hold an image to start multi-select organizing and sharing
              </p>
            )}
          </div>

          {isLoading ? (
            <GallerySkeleton />
          ) : images.length > 0 ? (
            <div className="space-y-6 mx-auto max-w-7xl">
              {searchQuery && (
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full shrink-0 hover:bg-secondary/80"
                    title="Show all images"
                    aria-label="Show all images"
                  >
                    <Home className="w-5 h-5" />
                  </Button>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Search results for &quot;{searchQuery}&quot;
                  </h2>
                </div>
              )}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {images.map((img) => (
                  <div key={img.path} className="break-inside-avoid">
                    <GalleryImage
                      img={img}
                      onDownload={handleDownload}
                      onToggle={handleToggle}
                      onDelete={() => handleDelete(img)}
                      onClick={() => handleCardClick(img)}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedPaths.includes(img.path)}
                      onSelect={() => toggleSelectedPath(img.path)}
                      onLongPress={() => handleLongPressSelect(img.path)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
                <Images className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {searchQuery ? "No results found" : "No images yet"}
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? "Try a different search term."
                    : "Upload your first image to start building your collection."}
                </p>
              </div>
              {searchQuery ? (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full cursor-pointer"
                >
                  Show all images
                </Button>
              ) : (
                <Link href="/upload" prefetch>
                  <Button
                    size="lg"
                    className="rounded-full font-semibold cursor-pointer"
                  >
                    Publish your first Image
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-[800px] w-full bg-background/95 backdrop-blur-sm border-none p-0 overflow-hidden">
          <div className="relative w-full h-[600px] max-h-[60vh] flex items-center justify-center bg-black/5">
            {selectedImage && (
              <Image
                src={selectedImage.signedUrl as string}
                alt={selectedImage.name}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background border-t gap-4">
            <div className="flex flex-col min-w-0 flex-1 w-full">
              <DialogTitle className="font-semibold text-lg truncate">
                {truncateFileName(selectedImage?.name || "", 30)}
              </DialogTitle>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-muted-foreground">
                  {formatSize(selectedImage?.size || 0)}
                </p>
                {selectedImage?.created_at && (
                  <p className="text-xs text-muted-foreground">
                    Uploaded{" "}
                    {new Date(selectedImage.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedImage?.path) {
                    handleShare([selectedImage.path]);
                  }
                }}
                disabled={createShareMutation.isPending}
                className="cursor-pointer"
              >
                {createShareMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Share Link
                  </>
                )}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (selectedImage) {
                    handleDownload(
                      selectedImage.signedUrl as string,
                      selectedImage.path
                    );
                  }
                }}
                className="cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGroupDialogOpen}
        onOpenChange={(open) => setIsGroupDialogOpen(open)}
      >
        <DialogContent className="max-w-md w-[92vw] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Organize Selected Images</DialogTitle>
            <DialogDescription>
              Add {selectedPaths.length} selected image
              {selectedPaths.length > 1 ? "s" : ""} to a group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="existing-group" className="text-sm font-medium">
                Existing groups
              </label>
              <Dropdown
                id="existing-group"
                value={selectedGroupId}
                aria-label="Select existing group"
                onChange={setSelectedGroupId}
                options={[
                  { value: "", label: "Select a group" },
                  ...groups.map((group) => ({
                    value: group.id,
                    label: group.name,
                  })),
                ]}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-group-name" className="text-sm font-medium">
                Create new group
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="new-group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Summer Trip"
                  className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
                  maxLength={60}
                  aria-label="New group name"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateGroup}
                  disabled={createGroupMutation.isPending}
                  className="cursor-pointer"
                >
                  {createGroupMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={assignGroupMutation.isPending || !selectedGroupId}
              onClick={handleAssignGroup}
            >
              {assignGroupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Selected to Group"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingImage}
        onOpenChange={(open) => !open && setDeletingImage(null)}
      >
        <DialogContent className="max-w-md w-[90vw] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingImage?.name}&quot;?
              This action cannot be undone.
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
  isSelectionMode,
  isSelected,
  onSelect,
  onLongPress,
}: {
  img: GalleryImage;
  onDownload: (url: string, path: string) => void;
  onToggle: (path: string) => void;
  onDelete: (img: GalleryImage) => void;
  onClick: () => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onLongPress: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const longPressTriggeredRef = useRef(false);

  const clearLongPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setIsPressing(false);
  };

  const startLongPress = () => {
    if (isSelectionMode) return;
    setIsPressing(true);
    longPressTimeoutRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPress();
      setIsPressing(false);
    }, 420);
  };

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden bg-secondary/20 mb-4 cursor-pointer",
        isLoading && "h-64"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        clearLongPress();
      }}
      onMouseDown={startLongPress}
      onMouseUp={clearLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={clearLongPress}
      onTouchCancel={clearLongPress}
      onContextMenu={(e) => {
        if (!isSelectionMode) {
          e.preventDefault();
          onLongPress();
        }
      }}
      onClick={(e) => {
        if (longPressTriggeredRef.current) {
          e.preventDefault();
          e.stopPropagation();
          longPressTriggeredRef.current = false;
          return;
        }
        onClick();
      }}
    >
      {isLoading && (
        <Skeleton className="w-full h-full absolute inset-0 z-10" />
      )}

      <Image
        src={img.signedUrl as string}
        alt={img.name || "Gallery Image"}
        width={500}
        height={500}
        className={cn(
          "w-full h-auto object-cover transition-transform duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          isHovered && "scale-105",
          isPressing && "scale-[1.02]"
        )}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />

      {isSelectionMode && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          variant="secondary"
          size="icon"
          aria-label={isSelected ? "Deselect image" : "Select image"}
          className={cn(
            "absolute top-3 left-3 rounded-full h-10 w-10 border-none shadow-md z-20",
            isSelected
              ? "bg-emerald-500 hover:bg-emerald-500 text-white ring-2 ring-white/90"
              : "bg-black/70 hover:bg-black/80 text-white ring-1 ring-white/60"
          )}
        >
          <CheckCircle2
            className={cn(
              "h-5 w-5",
              isSelected ? "fill-white text-white" : "text-white/80"
            )}
          />
        </Button>
      )}

      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 flex flex-col justify-between p-4",
          isSelectionMode || isHovered ? "opacity-100" : "opacity-0"
        )}
      >
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
                aria-label={img.favorite ? "Unfavorite image" : "Favorite image"}
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
          <span className="text-white font-medium truncate max-w-[150px]">
            {truncateFileName(img.name)}
          </span>

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
                  aria-label="Download image"
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
                  aria-label="Delete image"
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
