<script setup>
definePageMeta({
  layout: "game",
});

const gameSetup = useState("gameSetup");
if (!gameSetup.value) {
  navigateTo("/");
}

const { data: questionBank, pending, error, refresh } = await useGetQuestions(gameSetup.value?.amount, gameSetup.value?.category, gameSetup.value?.difficulty);
// Helper function: Fisher-Yates array shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
// Transform questions to include a unified, shuffled 'options' array
const questions = computed(() => {
  if (!questionBank.value?.results) return [];

  return questionBank.value.results.map((q) => {
    // 1. Create option objects
    const formattedOptions = [
      { text: q.correct_answer, isCorrect: true },
      ...q.incorrect_answers.map((incorrect) => ({
        text: incorrect,
        isCorrect: false,
      })),
    ];

    //Return question with the combined & shuffled options
    return {
      ...q,
      options: shuffleArray(formattedOptions),
    };
  });
});
</script>
<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Progress -->
    <div class="h-1.5 bg-gray-100">
      <div class="h-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all duration-500" />
      <!-- style={{ width: `${(currentIdx / total) * 100}%` }} -->
    </div>

    <main class="flex-1 flex flex-col items-center px-6 py-10">
      <div v-if="!gameSetup">Redirecting to game setup...</div>
      <div v-else-if="pending">Loading your quiz...</div>
      <div v-else-if="questions" v-for="(question, qIndex) in questions" :key="qIndex" class="w-full max-w-2xl">
        <!-- Question Counter  -->
        <div class="flex items-center justify-between mb-6">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest"> Question {{ qIndex + 1 }} / {{ questions.length }} </span>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full">
            {{ question.difficulty }}
          </span>
        </div>

        <!-- Question -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200 min-h-[120px] flex items-center">
          <h2 v-html="question.question" class="text-2xl font-bold text-gray-900 leading-snug break-words [overflow-wrap:anywhere]"></h2>
        </div>

        <!-- Options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button v-for="(option, oIndex) in question.options" :key="oIndex" class="relative rounded-xl border-2 p-4 text-left text-sm font-medium transition-all duration-200">
            <span class="inline-block w-6 h-6 rounded-lg bg-white border border-gray-200 text-center text-xs font-bold mr-3 leading-6 text-gray-500">
              {{ String.fromCharCode(65 + oIndex) }}
            </span>
            <span v-html="option.text"></span>
            <!-- <span class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span> -->

            <!-- <span class="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500">✗</span> -->
          </button>
        </div>

        <!-- Dots -->
        <div class="flex justify-center gap-1.5 mt-8">
          <div class="rounded-full transition-all duration-300"></div>
        </div>
      </div>
    </main>
  </div>
</template>
