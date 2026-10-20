// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const reqHeaders = getRequestHeaders(event);
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";

  const cookies = parseCookies(event);
  const refreshToken = cookies.refresh_token;

  try {
    // Call backend refresh endpoint
    const response = await $fetch.raw<{ access_token: string }>(`${config.apiBaseUrl}/v1/refresh`, {
      method: "POST",
      headers: {
        Authorization: refreshToken ? `Bearer ${refreshToken}` : "",
        cookie: reqHeaders.cookie || "",
        "x-forwarded-for": clientIp,
        "user-agent": reqHeaders["user-agent"] || "",
      },
    });

    // Safely forward rotated Set-Cookie headers from backend to the browser client
    const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get("set-cookie")].filter((c): c is string => Boolean(c));

    for (const cookieStr of setCookies) {
      appendResponseHeader(event, "set-cookie", cookieStr);
    }

    const accessToken = response._data?.access_token;
    if (!accessToken) {
      await clearUserSession(event);
      throw createError({
        statusCode: 502,
        statusMessage: "Invalid response from authentication server.",
      });
    }

    // Update Nuxt Auth Session
    const session = await getUserSession(event);
    await replaceUserSession(event, {
      user: session.user || undefined,
      secure: {
        accessToken,
      },
    });

    return { success: true };
  } catch (error: any) {
    await clearUserSession(event);

    if (error?.fatal || error?.statusCode === 502) {
      throw error;
    }

    const backendStatus = error?.statusCode || error?.status || 401;
    const backendError = error?.data?.error || error?.data?.message;

    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Session expired. Please log in again.",
    });
  }
});
