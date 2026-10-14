// server/api/leaderboard/[category]/index.get.ts
export default defineEventHandler(async (event) => {
  // Mengambil satu per satu parameter
  const category = getRouterParam(event, "category");

  const config = useRuntimeConfig(event);

  try {
    const scores = await $fetch<any[]>(`${config.apiBaseUrl}/v1/leaderboards/${category}`, {
      method: "GET",
    });

    return {
      success: true,
      message: scores,
    };
  } catch (error: any) {
    const backendStatus = error?.statusCode || error?.status || 500;
    const backendError = error?.data?.error || error?.data?.message;
    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Failed to fetch leaderboards.",
    });
  }
});
