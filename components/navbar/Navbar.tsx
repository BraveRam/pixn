import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import SignOutButton from "./SignOutButton";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { NavLinks } from "./NavLinks";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Pixn Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                Pixn
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <NavLinks />

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/upload">
                      <Button className="rounded-full gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Publish
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload new images</p>
                  </TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border mx-1" />

                <ThemeToggle />

                {user ? (
                  <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end lg:flex">
                      <span className="text-sm font-medium leading-none">
                        {user.user_metadata.full_name || user.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SignOutButton />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign out</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <Link href="/auth/sign-in">
                    <Button variant="default" className="rounded-full cursor-pointer">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link href="/upload">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
              <ThemeToggle />
              <MobileMenu user={user} />
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
