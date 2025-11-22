"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary transition-colors cursor-pointer"
            >
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <AnimatedThemeToggler className="cursor-pointer" />
    );
}
