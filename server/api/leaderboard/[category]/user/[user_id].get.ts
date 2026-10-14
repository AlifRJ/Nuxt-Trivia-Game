// server/api/leaderboard/[category]/user/[user_id].get.ts
export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, "category");
  const userId = getRouterParam(event, "user_id");

  const session = await getUserSession(event);
  const accessToken = session.secure?.accessToken;

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized. Please login first.",
    });
  }

  const config = useRuntimeConfig(event);

  try {
    const data = await $fetch<{ userRank: any }>(`${config.apiBaseUrl}/v1/leaderboards/${category}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: data.userRank,
    };
  } catch (error: any) {
    const backendStatus = error?.statusCode || error?.status || 500;
    const backendError = error?.data?.error || error?.data?.message;
    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Failed to fetch user scores.",
    });
  }
});
