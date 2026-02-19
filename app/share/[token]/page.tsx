import Link from "next/link";
import Image from "next/image";
import { verifyShareToken } from "@/lib/shareToken";
import { Button } from "@/components/ui/button";

function formatSize(sizeInBytes: number): string {
  if (!sizeInBytes || Number.isNaN(sizeInBytes)) return "Unknown";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB"];
  return `${(sizeInBytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default async function SharedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = verifyShareToken(token);

  if (!payload || payload.items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Invalid or expired share link</h1>
          <p className="text-muted-foreground">
            Ask the owner to generate a new link.
          </p>
          <Link href="/">
            <Button>Go to Pixn</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-10 pb-16">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Shared Photos</h1>
          <p className="text-muted-foreground">
            {payload.items.length} image{payload.items.length > 1 ? "s" : ""} ·
            Link expires {new Date(payload.exp).toLocaleString("en-US")}
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {payload.items.map((item) => (
            <article
              key={item.path}
              className="break-inside-avoid rounded-xl overflow-hidden border border-border bg-card"
            >
              <div className="relative w-full">
                <Image
                  src={item.signedUrl}
                  alt={item.name || "Shared image"}
                  width={1000}
                  height={1000}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.size)}
                  </p>
                </div>
                <a
                  href={item.signedUrl}
                  download={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline shrink-0"
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
