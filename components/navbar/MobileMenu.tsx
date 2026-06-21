"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlignJustify,
  BookHeart,
  Images,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FastLink } from "@/components/navigation/FastLink";

import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

const MobileMenu = ({ user }: Props) => {
  const fullName = user?.user_metadata?.full_name || user?.email || "";
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close mobile menu" : "Open mobile menu"}
      >
        {open ? <X /> : <AlignJustify />}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 flex flex-col p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 mb-2 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground">
              Signed in as
            </p>
            <p className="text-sm font-bold truncate text-foreground">
              {fullName}
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              pathname === "/gallery" && "bg-secondary font-medium"
            )}
          >
            <FastLink href="/gallery" onClick={() => setOpen(false)}>
              <Images className="w-4 h-4" />
              Gallery
            </FastLink>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              pathname === "/chat" && "bg-secondary font-medium"
            )}
          >
            <FastLink href="/chat" onClick={() => setOpen(false)}>
              <MessageSquare className="w-4 h-4" />
              Chat
            </FastLink>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              pathname === "/fav" && "bg-secondary font-medium"
            )}
          >
            <FastLink href="/fav" onClick={() => setOpen(false)}>
              <BookHeart className="w-4 h-4" />
              Favorites
            </FastLink>
          </Button>

          <div className="h-px bg-border my-2" />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to sign out?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/auth/sign-in");
                    router.refresh();
                  }}
                >
                  Sign Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
