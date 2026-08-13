<script setup>
const start = ref("");
</script>
<template>
  <main class="flex-1 flex flex-col items-center px-6 py-10">
    <div class="w-full max-w-2xl">
      <!-- Hero -->
      <div class="text-center mb-10">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          Test Your
          <span class="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent"> Knowledge</span>
        </h1>
        <p class="text-gray-500 text-base">Pick a category, set the difficulty, and see how you score.</p>
      </div>

      <!-- Category -->
      <section class="mb-8">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Category</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br ring-2 ring-offset-2 ring-emerald-400 scale-[1.02] shadow-md">
            <span class="text-2xl block mb-1">🔬</span>
            <span class="text-sm font-semibold text-gray-800">Science</span>
            <span class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br hover:scale-[1.01] hover:shadow-sm">
            <span class="text-2xl block mb-1">🏛️</span>
            <span class="text-sm font-semibold text-gray-800">History</span>
          </button>
          <button class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br hover:scale-[1.01] hover:shadow-sm">
            <span class="text-2xl block mb-1">🌍</span>
            <span class="text-sm font-semibold text-gray-800">Geography</span>
          </button>
          <button class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br hover:scale-[1.01] hover:shadow-sm">
            <span class="text-2xl block mb-1">🎬</span>
            <span class="text-sm font-semibold text-gray-800">Entertainment</span>
          </button>
          <button class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br hover:scale-[1.01] hover:shadow-sm">
            <span class="text-2xl block mb-1">⚽</span>
            <span class="text-sm font-semibold text-gray-800">Sports</span>
          </button>
        </div>
      </section>

      <!-- Difficulty -->
      <section class="mb-10">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Difficulty</h2>
        <div class="flex gap-3">
          <button class="flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all duration-150 ring-2 ring-offset-1 ring-current shadow-sm scale-[1.03]">
            <div>Easy</div>
            <div class="text-xs font-normal opacity-70 mt-0.5">20s . 15pts</div>
          </button>
          <button class="flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all duration-150 border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100">
            <div>Medium</div>
            <div class="text-xs font-normal opacity-70 mt-0.5">20s . 15pts</div>
          </button>
          <button class="flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all duration-150 border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100">
            <div>Hard</div>
            <div class="text-xs font-normal opacity-70 mt-0.5">20s . 15pts</div>
          </button>
        </div>
      </section>

      <!-- Start -->
      <button class="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 bg-gray-100 text-gray-400 cursor-not-allowed">Select a Category to Start</button>
      <button class="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]">Start Game →</button>

      <p class="text-center text-xs text-gray-400 mt-3">Choose a category above to begin</p>
    </div>
  </main>
</template>
