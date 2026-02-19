"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

type FastLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> &
  LinkProps & {
    href: string;
  };

export function FastLink({
  href,
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: FastLinkProps) {
  const router = useRouter();

  const prefetch = React.useCallback(() => {
    router.prefetch(href);
  }, [href, router]);

  React.useEffect(() => {
    prefetch();
  }, [prefetch]);

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={(e) => {
        prefetch();
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      {...props}
    />
  );
}
