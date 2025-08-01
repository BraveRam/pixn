"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { AlignJustify, BookHeart, Images, User, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

type Props = {
  fullName: string;
};

const MobileMenu = ({ fullName }: Props) => {
  const supabase = createClient()
  const router = useRouter()
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        {open ? <X /> : <AlignJustify />}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-md z-50 flex flex-col p-2">
          <Link href="/gallery" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <span className="flex items-center gap-2">
                <Images />
                Gallery
              </span>
            </Button>
          </Link>
          <Link href="/fav" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <span className="flex items-center gap-2">
                <BookHeart />
                Favorites
              </span>
            </Button>
          </Link>
          <p className="px-3 py-2 text-sm text-white font-extrabold">
            <span className="flex items-center gap-2">
              <User />
              {fullName}
            </span>
          </p>
          <Button onClick={()=>{
         supabase.auth.signOut()
         router.push("/auth/sign-in")
          }} type="submit" variant="destructive" className="w-full mt-2">
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
