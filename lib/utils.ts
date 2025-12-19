import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateFileName(name: string, maxLength: number = 20) {
  if (name.length <= maxLength) return name;
  const extension = name.split(".").pop();
  if (!extension) return name.slice(0, maxLength) + "...";

  const extLength = extension.length + 1;
  const nameLength = maxLength - extLength - 3;

  if (nameLength < 1) return name.slice(0, maxLength) + "...";

  return `${name.slice(0, nameLength)}...${extension}`;
}
