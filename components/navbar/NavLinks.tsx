"use client";

import { FastLink } from "@/components/navigation/FastLink";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavLinks() {
    const pathname = usePathname();

    const links = [
        { href: "/gallery", label: "Gallery" },
        { href: "/chat", label: "Chat" },
        { href: "/fav", label: "Favorites" },
    ];

    return (
        <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Button
                        key={link.href}
                        asChild
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "rounded-full px-4 hover:bg-background cursor-pointer transition-all duration-200",
                            isActive && "bg-background text-foreground shadow-sm font-medium"
                        )}
                    >
                        <FastLink href={link.href}>{link.label}</FastLink>
                    </Button>
                );
            })}
        </div>
    );
}
