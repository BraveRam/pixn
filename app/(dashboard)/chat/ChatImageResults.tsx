"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ImageSearchResultImage } from "@/lib/chat/types";

interface ChatImageResultsProps {
  images: ImageSearchResultImage[];
  query: string;
}

export function ChatImageResults({ images, query }: ChatImageResultsProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((image) => (
          <a
            key={image.path}
            href={image.signedUrl}
            target="_blank"
            rel="noreferrer"
            title={image.description ?? image.name}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary/30"
          >
            {/* Plain img: signed URLs rotate, so we skip the next/image optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.signedUrl}
              alt={image.description ?? image.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
      <Link
        href={`/gallery?q=${encodeURIComponent(query)}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Open these in Gallery
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
