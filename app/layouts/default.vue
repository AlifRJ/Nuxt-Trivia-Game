<script setup>
const { user, loggedIn, clear } = useUserSession();

const userInitial = computed(() => {
  const name = user.value?.username || user.value?.name || user.value?.email || "U";
  return name.charAt(0).toUpperCase();
});

const displayName = computed(() => {
  return user.value?.username || user.value?.name || user.value?.email || "User";
});

const isLoggingOut = ref(false);

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;

  try {
    // 1. Call Nitro API to invalidate token/session on backend & clear encrypted cookie
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.error("Logout request failed, clearing local session anyway:", err);
  } finally {
    // 2. Clear client-side session state
    await clear();
    isLoggingOut.value = false;

    // 3. Redirect to login page
    await navigateTo("/");
  }
};
</script>

<template>
  <header class="border-b border-gray-100 bg-white px-6 py-3 sticky top-0 z-10">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center shadow-sm">
          <span class="text-white text-lg">❓</span>
        </div>
        <span class="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors"> Trivio </span>
      </NuxtLink>

      <!-- Navigation & Auth state -->
      <div class="flex items-center gap-3">
        <!-- Leaderboard Link -->
        <NuxtLink to="/score-board" class="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500 hover:text-gray-800 hover:bg-gray-100" exact-active-class="!bg-sky-100 !text-sky-700">
          <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
            <rect x="1" y="8" width="3" height="7" rx="1" fill="currentColor" opacity=".5" />
            <rect x="6" y="4" width="3" height="11" rx="1" fill="currentColor" opacity=".75" />
            <rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor" />
          </svg>
          Leaderboard
        </NuxtLink>

        <!-- Authenticated State -->
        <div v-if="loggedIn" class="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
            {{ userInitial }}
          </div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">
            {{ displayName }}
          </span>
          <button @click="handleLogout" :disabled="isLoggingOut" class="text-xs text-gray-400 hover:text-rose-500 transition-colors ml-1 p-1 rounded hover:bg-rose-50 disabled:opacity-50" title="Sign out">
            <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- Guest State -->
        <div v-else class="flex items-center gap-2 pl-3 border-l border-gray-200">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"> Sign in </NuxtLink>
        </div>
      </div>
    </div>
  </header>
  <slot />
</template>
