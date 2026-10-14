import { ofetch } from "ofetch";

export default defineNuxtPlugin(() => {
  const $api = ofetch.create({
    async onResponseError(context) {
      if (context.response?.status === 401) {
        try {
          await $fetch("/api/auth/refresh", { method: "POST" });

          // 2. Ulangi request original menggunakan $api bawaan
          const retryResponse = await $api.raw(context.request, context.options);
          context.response = retryResponse;
        } catch (refreshError) {
          // Jika refresh token juga hangus, arahkan ke login
          await navigateTo("/login");
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

// const { $api } = useNuxtApp() tambahkan di setiap page/component agar plugin running
