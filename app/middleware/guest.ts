// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  // If user is already logged in, redirect them away from login/register to dashboard
  if (loggedIn.value) {
    return navigateTo("/", { replace: true });
  }
});
