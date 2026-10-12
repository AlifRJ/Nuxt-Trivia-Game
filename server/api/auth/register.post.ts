// server/api/auth/register.post.ts
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username cannot exceed 20 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => registerSchema.parse(data));

  try {
    const data = await $fetch<{ message: string }>("http://localhost:8080/v1/register", {
      method: "POST",
      body,
    });

    return {
      success: true,
      message: data.message || "Registration successfully.",
    };
  } catch (error: any) {
    const backendStatus = error?.statusCode || error?.status || 500;
    const backendError = error?.data?.error || error?.data?.message;
    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Registration failed.",
    });
  }
});
