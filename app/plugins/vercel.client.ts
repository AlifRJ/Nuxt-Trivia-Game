// plugins/vercel.client.ts
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize Vercel Analytics
  injectAnalytics();

  // Initialize Vercel Speed Insights with Nuxt router integration
  const router = useRouter();
  injectSpeedInsights({
    framework: 'nuxt',
    route: router.currentRoute.value.path, // Initial route path
  });

  // Track route transitions for SPA navigation
  router.afterEach((to) => {
    injectSpeedInsights({
      framework: 'nuxt',
      route: to.path,
    });
  });
});