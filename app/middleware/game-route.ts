export default defineNuxtRouteMiddleware((to, from) => {
  // Secure /game route accessible from other route other than index
  if (from.path !== "/") {
    return navigateTo("/");
  }
});
