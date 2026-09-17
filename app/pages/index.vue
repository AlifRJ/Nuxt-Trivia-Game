<script setup>
useSeoMeta({
  title: "Trivio - Test Your Knowledge Across Categories",
  description: "Test your brain with Trivio! Choose from science, history, geography, and sports trivia.",

  // Open Graph (Facebook, LinkedIn, Discord)
  ogTitle: "Trivio - Ready to Test Your Knowledge?",
  ogDescription: "Pick a category, answer tough questions, Jump into science, history, and sports quizzes!",
  // ogImage: "https://yourdomain.com/images/trivio-og-cover.png",
  // ogImageUrl: "https://yourdomain.com/images/trivio-og-cover.png",
  ogType: "website",
  ogSiteName: "Trivio",

  // Twitter / X
  twitterCard: "summary_large_image",
  twitterTitle: "Trivio - Pick a Quiz & Start Playing",
  twitterDescription: "Test your knowledge across history, science, sports and more on Trivio!",
  // twitterImage: "https://yourdomain.com/images/trivio-og-cover.png",

  // Search Engine Directives
  robots: "index, follow",
});

const categories = ref([
  { id: 9, icon: "🧠", title: "General Knowledge", active: false },
  { id: 15, icon: "🎮", title: "Video Games", active: false },
  { id: 17, icon: "🔬", title: "Science", active: false },
  { id: 23, icon: "🏛️", title: "History", active: false },
  { id: 22, icon: "🌍", title: "Geography", active: false },
  { id: 20, icon: "🦄", title: "Mythology", active: false },
  { id: 21, icon: "⚽", title: "Sports", active: false },
]);

const difficulties = ref([
  { type: "easy", time: 30, points: 10, active: false },
  { type: "medium", time: 20, points: 20, active: false },
  { type: "hard", time: 12, points: 30, active: false },
]);

const containerRef = useDragScroll();

const category = ref(null);
const difficulty = ref(null);
const amount = 10;

const gameSetup = useState("gameSetup");
const startGame = (quizData) => {
  gameSetup.value = quizData;
  navigateTo(`/gameplay/game`);
};

const toggleCategory = (cat) => {
  category.value = cat;
};

const toggleDifficulty = (diff) => {
  difficulty.value = diff;
};
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <main class="flex-1 flex flex-col items-center px-6 py-10">
      <div class="w-full max-w-2xl">
        <!-- User stats strip -->
        <!-- <div v-if="games_played>=1" class="flex gap-3 mb-8">
          <div class="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center">
            <div class="text-2xl font-extrabold text-emerald-600">100</div>
            <div class="text-xs text-gray-500 font-medium">Best Score</div>
          </div>
          <div class="flex-1 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-center">
            <div class="text-2xl font-extrabold text-sky-600">1</div>
            <div class="text-xs text-gray-500 font-medium">Games Played</div>
          </div>
          <div class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center">
            <div class="text-2xl font-extrabold text-gray-700">90%</div>
            <div class="text-xs text-gray-500 font-medium">Avg Accuracy</div>
          </div>
        </div> -->

        <!-- Hero -->
        <div class="text-center mb-10">
          <h1 class="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            Test Your
            <span class="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent"> Knowledge</span>
          </h1>
          <p class="text-gray-500 text-base">Pick a category, set the difficulty, and see how you score.</p>
        </div>
        <!-- <div class="text-center mb-8">
          <h1 v-if="games_played>=1" class="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">Welcome back, Randy!</h1>
          <h1 class="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">Ready to play, Randy?</h1>
          <p class="text-gray-500 text-sm">Pick a category, set the difficulty, and see how you score.</p>
        </div> -->

        <!-- Category -->
        <section class="mb-7">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Category</h2>

          <div ref="containerRef" class="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6" style="scrollbar-width: none">
            <CategoryButton v-for="cat in categories" :key="cat.id" @click="toggleCategory(cat)" :data="cat" :isActive="category?.id === cat.id" />
          </div>

          <div v-if="category != null" class="mt-3 flex items-center gap-3 rounded-xl border-2 px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 hover:border-sky-400 transition-all duration-200">
            <span class="text-3xl">{{ category.icon }}</span>
            <div>
              <div class="text-sm font-bold text-gray-800">{{ category.title }}</div>
              <div class="text-xs text-gray-500">10 questions available</div>
            </div>
            <button @click="toggleCategory(null)" class="ml-auto text-gray-400 hover:text-gray-600 transition-colors" aria-label="Deselect">
              <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </section>

        <!-- Difficulty -->
        <section class="mb-8">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Difficulty</h2>
          <div class="flex gap-3">
            <DifficultyButton v-for="diff in difficulties" :key="diff.type" @click="toggleDifficulty(diff)" :data="diff" :isActive="difficulty?.type === diff.type" />
          </div>
        </section>

        <!-- Start -->
        <div v-if="category !== null && difficulty !== ''">
          <button
            @click="startGame({ category: category, difficulty: difficulty, amount: amount })"
            class="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
          >
            Start Game →
          </button>
        </div>
        <div v-else>
          <button class="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 bg-gray-100 text-gray-400 cursor-not-allowed" disabled>Select a Category & Difficulty</button>
        </div>
      </div>
    </main>
  </div>
</template>
