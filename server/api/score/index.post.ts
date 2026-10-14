// server/api/score/index.post.ts
import { z } from "zod";

const registerSchema = z.object({
  score: z.number().min(0, { message: "Score must be a positive number." }),
  category: z.string({ message: "Category must be a string." }),
  difficulty: z.string({ message: "Category must be a string." }),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => registerSchema.parse(data));
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
    const data = await $fetch<{ score: any }>(`${config.apiBaseUrl}/v1/scores`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    return {
      success: true,
      score: data.score,
    };
  } catch (error: any) {
    const backendStatus = error?.statusCode || error?.status || 500;
    const backendError = error?.data?.error || error?.data?.message;
    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Failed to save score.",
    });
  }
});
