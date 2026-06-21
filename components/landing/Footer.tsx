import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-medium text-white"
          >
            <Image
              src="/logo.png"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
            />
            <span>Pixn</span>
          </Link>
          <p className="text-sm text-zinc-500">
            Search your photos by meaning.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex gap-8 text-sm text-zinc-400"
        >
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>
          <Link
            href="/auth/sign-in"
            className="transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/5 pt-8 text-center text-sm text-zinc-600 md:text-left">
        © 2026 Pixn. All rights reserved.
      </div>
    </footer>
  );
}
