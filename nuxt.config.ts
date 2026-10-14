// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-auth-utils"],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiBaseUrl: "",
  },
  app: {
    head: {
      titleTemplate: "%s | Trivio",
      meta: [{ name: "author", content: "Trivio Team" }],
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    },
  },
  routeRules: {
    "/login": { redirect: { to: "/auth/login", statusCode: 301 } },
    "/register": { redirect: { to: "/auth/register", statusCode: 301 } },
  },
});
