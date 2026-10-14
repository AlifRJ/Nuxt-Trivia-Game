// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const config = useRuntimeConfig(event);

  if (session?.secure?.accessToken) {
    try {
      await $fetch<{ message: string }>(`${config.apiBaseUrl}/v1/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.secure.accessToken}`,
        },
      });
    } catch (error: any) {
      console.error("External backend logout failed:", error?.data?.error || error?.message);
    }
  }
  await clearUserSession(event);

  return {
    success: true,
    message: "Logged out successfully",
  };
});
