"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  fullName: string;
};

const MobileMenu = ({ fullName }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        ☰
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-md z-50 flex flex-col p-2">
          <Link href="/gallery" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/fav" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Favorites
            </Button>
          </Link>
          <p className="px-3 py-2 text-sm text-white font-semibold">
            {fullName}
          </p>
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="destructive" className="w-full mt-2">
              Sign Out
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
