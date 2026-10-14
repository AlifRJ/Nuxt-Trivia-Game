<script setup>
useHead({
  title: "Leaderboard",
});

const { loggedIn, user } = useUserSession();

// Category options (Default: All Categories)
const categories = [
  { label: "All Categories", value: "global" },
  { label: "General Knowledge", value: "General Knowledge" },
  { label: "Video Games", value: "Video Games" },
  { label: "Science", value: "Science" },
  { label: "History", value: "History" },
  { label: "Geography", value: "Geography" },
  { label: "Mythology", value: "Mythology" },
  { label: "Sports", value: "Sports" },
];

// Default to "global" on page load
const selectedCategory = ref("global");

// Fetch from Nuxt Proxy (re-fetches automatically when selectedCategory changes)
const { data: response, pending, error } = await useFetch(() => `/api/leaderboard/${selectedCategory.value}`, { watch: [selectedCategory] });

// Extract raw array from server response
const scores = computed(() => response.value?.message || []);

const getRankBadge = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
};
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <main class="flex-1 px-6 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-end justify-between mb-6">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900">Leaderboard</h1>
            <p class="text-gray-500 text-sm mt-1">Top scores across all players</p>
          </div>
        </div>

        <!-- Guest Callout Banner -->
        <div v-if="!loggedIn" class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between gap-4">
          <p class="text-xs text-emerald-800"><span class="font-bold">Playing as Guest:</span> Sign in to save your scores to the global leaderboard!</p>
          <NuxtLink to="/login" class="flex-shrink-0 text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700 transition-colors"> Sign In </NuxtLink>
        </div>

        <!-- Category Filters (Defaults to "All Categories") -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectedCategory = cat.value"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            :class="selectedCategory === cat.value ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="pending" class="space-y-2 py-4">
          <div v-for="n in 5" :key="n" class="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500">
          <div class="text-5xl mb-4">⚠️</div>
          <p class="text-sm font-medium">{{ error.statusMessage || "Failed to load leaderboard." }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!scores.length" class="text-center py-20 text-gray-400">
          <div class="text-5xl mb-4">📋</div>
          <p class="text-sm font-medium">No scores found for this category.</p>
        </div>

        <!-- Leaderboard List -->
        <div v-else class="space-y-2">
          <div
            v-for="(item, index) in scores"
            :key="item.id || item.userID || index"
            class="flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all bg-white border-gray-100 hover:border-gray-200"
            :class="{
              'ring-2 ring-emerald-500/20 bg-emerald-50/30': user && (item.userId === user.id || item.userID === user.id || item.username === user.username),
            }"
          >
            <!-- Rank / Medal -->
            <div class="w-8 text-center flex-shrink-0">
              <span v-if="index < 3" class="text-xl">{{ getRankBadge(index) }}</span>
              <span v-else class="text-sm font-bold text-gray-400">{{ getRankBadge(index) }}</span>
            </div>

            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-emerald-600">
              {{ (item.username || item.name || "A").charAt(0).toUpperCase() }}
            </div>

            <!-- Player Meta -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-900 truncate">
                  {{ item.username || item.name || "Anonymous" }}
                </span>
                <span v-if="user && (item.userId === user.id || item.userID === user.id || item.username === user.username)" class="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-semibold"> You </span>
              </div>
              <div class="text-xs text-gray-400 flex gap-2 mt-0.5 capitalize">
                <span>{{ item.category || (selectedCategory === "all" ? "General" : selectedCategory) }}</span>
                <template v-if="item.difficulty">
                  <span>·</span>
                  <span class="font-medium text-emerald-500">{{ item.difficulty }}</span>
                </template>
              </div>
            </div>

            <!-- Score -->
            <div class="text-right flex-shrink-0">
              <div class="text-lg font-extrabold text-gray-900">{{ item.score }}</div>
              <div v-if="item.correctCount" class="text-xs text-gray-400">{{ item.correctCount }}/{{ item.totalQuestions || 10 }} correct</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
