import React from "react";
import FileUploadFormDemo from "./UploadForm";
import Link from "next/link";
import { ArrowUpRight, ImagePlus, Search, ShieldCheck } from "lucide-react";

const page = () => {
  return (
    <div className="relative min-h-screen bg-background pt-24 pb-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[70vw] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] items-start">
          <section className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Pixn Upload Studio
            </span>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Publish Images
                <br />
                <span className="text-red-500">With Confidence</span>
              </h1>
              <p className="max-w-xl text-muted-foreground text-base sm:text-lg">
                Drop files, publish instantly, and let AI organize your gallery
                for fast semantic search later.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <FeatureCard
                icon={<ImagePlus className="h-5 w-5" />}
                title="Fast Uploads"
                description="Publish up to 3 images in one go."
              />
              <FeatureCard
                icon={<Search className="h-5 w-5" />}
                title="Smart Search"
                description="AI descriptions enable natural language search."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Private by Default"
                description="Your gallery is account-scoped and protected."
              />
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-red-500 transition-colors"
            >
              Go to gallery
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur p-5 sm:p-7 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.35)]">
            <div className="mb-5 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Upload Panel</h2>
              <p className="text-sm text-muted-foreground">
                Maximum 5MB per image. Accepted type: image/*.
              </p>
            </div>
            <FileUploadFormDemo />
          </section>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <article className="rounded-2xl border border-border/70 bg-card px-4 py-4">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </article>
  );
};

export default page;
