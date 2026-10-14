// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Refresh token not found or invalid.",
    });
  }

  const config = useRuntimeConfig(event);

  try {
    const data = await $fetch<{ access_token: string }>(`${config.apiBaseUrl}/v1/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    await setUserSession(event, {
      secure: {
        accessToken: data.access_token,
      },
    });

    return { success: true };
  } catch (error: any) {
    const backendStatus = error?.statusCode || error?.status || 401;
    const backendError = error?.data?.error || error?.data?.message;
    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Invalid credentials.",
    });
  }
});
