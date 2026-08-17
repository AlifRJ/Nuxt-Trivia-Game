<script setup>
definePageMeta({
  layout: "game",
});

const gameOverSetup = useState("gameOverSetup");

// Guard: Redirect to home if game state doesn't exist
if (!gameOverSetup.value) {
  navigateTo("/");
}

const grades = [
  { label: "Outstanding!", emoji: "🏆", color: "text-emerald-600" },
  { label: "Great Job!", emoji: "🎉", color: "text-sky-600" },
  { label: "Not Bad!", emoji: "👍", color: "text-amber-600" },
  { label: "Keep Trying!", emoji: "💪", color: "text-rose-600" },
];

// Wrap totals inside a computed property to handle state safely and reactively
const total = computed(() => {
  const history = gameOverSetup.value?.answersHistory || [];
  const points = gameOverSetup.value?.points || [];

  const questionsLength = history.length;
  const correctAnswer = history.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
  const wrongAnswer = questionsLength - correctAnswer;
  const finalScore = points.reduce((acc, curr) => acc + curr, 0);
  const maxScore = (points[0] || 0) * questionsLength;
  const accuracy = questionsLength > 0 ? Math.round((correctAnswer / questionsLength) * 100) : 0;

  return {
    questionsLength,
    correctAnswer,
    wrongAnswer,
    finalScore,
    maxScore,
    accuracy,
  };
});

// Calculate grade based on accuracy percentage
const gameOverMessage = computed(() => {
  const accuracy = total.value.accuracy;
  console.log(accuracy);

  if (accuracy >= 90) {
    return grades[0];
  } else if (accuracy >= 70) {
    return grades[1];
  } else if (accuracy >= 50) {
    return grades[2];
  }
  return grades[3];
});
</script>

<template>
  <main class="flex-1 flex flex-col items-center px-6 py-10">
    <div v-if="gameOverSetup" class="w-full max-w-2xl">
      <!-- Result hero -->
      <div class="text-center mb-10">
        <div class="text-6xl mb-4">{{ gameOverMessage.emoji }}</div>
        <h1 :class="`text-4xl font-extrabold mb-2 ${gameOverMessage.color}`">
          {{ gameOverMessage.label }}
        </h1>
        <p class="text-gray-500 text-sm">
          {{ gameOverSetup?.category }} ·
          {{ gameOverSetup?.difficulty ? gameOverSetup.difficulty.charAt(0).toUpperCase() + gameOverSetup.difficulty.slice(1) : "" }}
        </p>
      </div>

      <!-- Score card -->
      <div class="bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 rounded-3xl p-8 mb-6">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-4xl font-extrabold text-gray-900 mb-1">{{ total.finalScore }}</div>
            <div class="text-xs text-gray-500 font-medium uppercase tracking-wide">Score</div>
            <div class="text-xs text-gray-400">/ {{ total.maxScore }} pts</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-emerald-600 mb-1">{{ total.correctAnswer }}/{{ total.questionsLength }}</div>
            <div class="text-xs text-gray-500 font-medium uppercase tracking-wide">Correct</div>
            <div class="text-xs text-gray-400">{{ total.accuracy }}% accuracy</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-sky-600 mb-1">{{ total.wrongAnswer }}</div>
            <div class="text-xs text-gray-500 font-medium uppercase tracking-wide">Wrong</div>
            <div class="text-xs text-gray-400">{{ 100 - total.accuracy }}% missed</div>
          </div>
        </div>

        <!-- Accuracy bar -->
        <div class="mt-6">
          <div class="flex justify-between text-xs text-gray-500 mb-2">
            <span>Accuracy</span>
            <span>{{ total.accuracy }}%</span>
          </div>
          <div class="h-3 bg-white rounded-full border border-gray-200 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-400 to-sky-500 rounded-full transition-all duration-1000" :style="{ width: `${total.accuracy}%` }" />
          </div>
        </div>
      </div>

      <!-- Answer breakdown -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 mb-8">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Answer Breakdown</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(answer, index) in gameOverSetup.answersHistory"
            :key="index"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            :class="[answer ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200']"
            :title="`Q${index + 1} : ${answer ? 'Correct' : 'Wrong'}`"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button @click="navigateTo('/')" class="flex-1 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
          Play Again ↺
        </button>
      </div>
    </div>
  </main>
</template>
