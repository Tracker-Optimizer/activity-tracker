const SESSION_COOKIE_NAME = "better-auth.session_token";

export function extractSessionToken(cookieHeader: string | null | undefined) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return cookie.substring(`${SESSION_COOKIE_NAME}=`.length);
    }
  }

  return null;
}
