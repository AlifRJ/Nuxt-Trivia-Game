<script setup>
const categories = ref([
  { id: 17, icon: "🔬", title: "Science", active: false },
  { id: 23, icon: "🏛️", title: "History", active: false },
  { id: 22, icon: "🌍", title: "Geography", active: false },
  { id: 20, icon: "🦄", title: "Mythology", active: false },
  { id: 21, icon: "⚽", title: "Sports", active: false },
]);

const difficulties = ref([
  { type: "easy", time: 30, points: 10, active: false },
  { type: "medium", time: 20, points: 20, active: false },
  { type: "hard", time: 10, points: 30, active: false },
]);

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
          <CategoryButton v-for="cat in categories" :key="cat.id" @click="toggleCategory(cat)" :data="cat" :isActive="category?.id === cat.id" />
        </div>
      </section>

      <!-- Difficulty -->
      <section class="mb-10">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Difficulty</h2>
        <div class="flex gap-3">
          <DifficultyButton v-for="diff in difficulties" :key="diff.type" @click="toggleDifficulty(diff)" :data="diff" :isActive="difficulty?.type === diff.type" />
        </div>
      </section>

      <!-- Start -->
      <!-- Adjusted condition to require both, or update text if only category is needed -->
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
        <p class="text-center text-xs text-gray-400 mt-3">Choose both options above to begin</p>
      </div>
    </div>
  </main>
</template>
