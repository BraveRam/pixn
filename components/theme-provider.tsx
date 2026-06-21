"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes (unmaintained) injects its anti-flash theme setter as an inline
// <script>. React 19 logs a false-positive console error for it — "Encountered a
// script tag while rendering React component" — even though the script renders and
// executes correctly during SSR (which is the whole point: it sets the theme before
// hydration to avoid a flash). There is no upstream fix and no prop to disable the
// script, so we filter only that exact message, only in development, so the Next.js
// dev overlay stays useful for real errors.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const taggedConsole = console as typeof console & {
    __nextThemesScriptFilter?: boolean;
  };

  if (!taggedConsole.__nextThemesScriptFilter) {
    taggedConsole.__nextThemesScriptFilter = true;
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Encountered a script tag while rendering React component")
      ) {
        return;
      }
      originalError(...args);
    };
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
