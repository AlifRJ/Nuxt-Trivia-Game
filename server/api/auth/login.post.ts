// server/api/auth/login.post.ts
import { z } from "zod";

const loginSchema = z.object({
  identity: z.string().min(1, { message: "Username or email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

interface LoginResponse {
  access_token: string;
  user: {
    id: string | number;
    email: string;
    username?: string;
    name?: string;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => loginSchema.parse(data));

  try {
    const data = await $fetch<LoginResponse>("http://localhost:8080/v1/login", {
      method: "POST",
      body,
    });

    await setUserSession(event, {
      user: data.user,
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
