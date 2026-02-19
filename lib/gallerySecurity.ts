export function isUserOwnedPath(userId: string, path: string): boolean {
  return path.startsWith(`${userId}/`);
}

export function createImageStoragePath(
  userId: string,
  fileName: string,
  uuidFactory: () => string = () => crypto.randomUUID()
): string {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${userId}/${uuidFactory()}-${safeFileName}`;
}
