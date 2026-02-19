const CONFIRM_PATH_PREFIX = "/auth/confirm";

export function getCanonicalOrigin(requestUrl: string): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).origin;
    } catch {
      // Fall through to request URL when env value is malformed.
    }
  }

  return new URL(requestUrl).origin;
}

export function validateEmailRedirectTo(
  redirectTo: string,
  requestUrl: string
): string | null {
  try {
    const requestOrigin = new URL(requestUrl).origin;
    const parsed = new URL(redirectTo);

    if (
      parsed.origin !== requestOrigin &&
      parsed.origin !== getCanonicalOrigin(requestUrl)
    ) {
      return null;
    }

    if (!parsed.pathname.startsWith(CONFIRM_PATH_PREFIX)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
