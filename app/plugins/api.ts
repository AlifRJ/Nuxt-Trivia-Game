// plugins/api.ts
import { ofetch } from "ofetch";

export default defineNuxtPlugin(() => {
  let isRefreshing = false;
  let refreshPromise: Promise<any> | null = null;

  const $api = ofetch.create({
    async onRequest({ options }) {
      const { session } = useUserSession();
      const secureData = session.value?.secure as { accessToken?: string } | undefined;
      const accessToken = secureData?.accessToken;

      if (accessToken) {
        options.headers = new Headers(options.headers);
        options.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    },

    async onResponseError(context) {
      const requestUrl = context.request.toString();

      // Avoid infinite loops if /api/auth/refresh throws 401
      if (requestUrl.includes("/api/auth/refresh")) {
        await navigateTo("/login");
        return;
      }

      if (context.response?.status === 401) {
        try {
          if (!isRefreshing) {
            isRefreshing = true;
            // Target /api/auth/refresh directly
            refreshPromise = $fetch("/api/auth/refresh", { method: "POST" }).finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
          }

          await refreshPromise;

          const { fetch: refreshSession, session } = useUserSession();
          await refreshSession();

          const secureData = session.value?.secure as { accessToken?: string } | undefined;
          const newAccessToken = secureData?.accessToken;

          const headers = new Headers(context.options.headers);
          if (newAccessToken) {
            headers.set("Authorization", `Bearer ${newAccessToken}`);
          }

          context.response = await $fetch.raw(context.request, {
            ...(context.options as any),
            headers,
          });

          return;
        } catch (error) {
          await navigateTo("/login");
          throw error;
        }
      }
    },
  });

  return {
    provide: {
      api: $api,
    },
  };
});
