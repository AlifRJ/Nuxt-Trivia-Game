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
  // Validate request body cleanly
  const body = await readValidatedBody(event, (data) => {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid input.";
      throw createError({
        statusCode: 400,
        statusMessage: firstError,
      });
    }
    return result.data;
  });

  const config = useRuntimeConfig(event);
  const reqHeaders = getRequestHeaders(event);
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";

  try {
    // Call Go backend login endpoint
    const response = await $fetch.raw<LoginResponse>(`${config.apiBaseUrl}/v1/login`, {
      method: "POST",
      body,
      headers: {
        "x-forwarded-for": clientIp,
        "user-agent": reqHeaders["user-agent"] || "",
      },
    });

    // Forward Set-Cookie headers from Go to the browser client
    const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get("set-cookie")].filter((c): c is string => Boolean(c));

    for (const cookieStr of setCookies) {
      appendResponseHeader(event, "set-cookie", cookieStr);
    }

    const data = response._data;
    if (!data?.access_token || !data?.user) {
      throw createError({
        statusCode: 502,
        statusMessage: "Invalid response from authentication server.",
      });
    }

    // Set encrypted Nuxt session
    await setUserSession(event, {
      user: data.user,
      secure: {
        accessToken: data.access_token,
      },
      loggedInAt: new Date(),
    });

    return { success: true, user: data.user };
  } catch (error: any) {
    if (error?.fatal || error?.statusCode === 400 || error?.statusCode === 502) {
      throw error;
    }

    const backendStatus = error?.statusCode || error?.status || 401;
    const backendError = error?.data?.error || error?.data?.message;

    throw createError({
      statusCode: backendStatus,
      statusMessage: backendStatus === 500 ? "Internal server error." : backendError || "Invalid credentials.",
    });
  }
});
