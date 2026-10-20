// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const config = useRuntimeConfig(event);
  const reqHeaders = getRequestHeaders(event);
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";

  // Cast secure session data safely
  const secureData = session?.secure as { accessToken?: string } | undefined;
  const accessToken = secureData?.accessToken;

  if (accessToken) {
    try {
      // Call backend logout endpoint
      const response = await $fetch.raw<{ message: string }>(`${config.apiBaseUrl}/v1/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          cookie: reqHeaders.cookie || "",
          "x-forwarded-for": clientIp,
          "user-agent": reqHeaders["user-agent"] || "",
        },
      });

      // Forward clear-cookie headers from backend back to browser safely
      const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get("set-cookie")].filter((c): c is string => Boolean(c));

      for (const cookieStr of setCookies) {
        appendResponseHeader(event, "set-cookie", cookieStr);
      }
    } catch (error: any) {
      console.error("External backend logout failed:", error?.data?.error || error?.message);
    }
  }

  // Clear Nuxt session locally regardless of backend outcome
  await clearUserSession(event);

  return {
    success: true,
    message: "Logged out successfully",
  };
});
