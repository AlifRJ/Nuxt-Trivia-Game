<script setup>
import { useShuffleQuestion } from "~/composables/useTrivia";

definePageMeta({
  layout: "game",
});

const gameSetup = useState("gameSetup");
if (!gameSetup.value) {
  navigateTo("/");
}

// Get Trivia Data
const { data: questionBank, pending, error } = await useGetQuestions(gameSetup.value?.amount, gameSetup.value?.category.id, gameSetup.value?.difficulty.type);

const currentQuestionIndex = ref(0);
const isGameFinished = ref(false);

// Track the result of each question (e.g., [true, false, true])
const answersHistory = ref([]);

const questions = ref([]);

// Display current question options
watch(
  () => questionBank.value?.results,
  (results) => {
    if (!results) return;
    questions.value = results.map((q) => {
      const formattedOptions = [
        { text: q.correct_answer, isCorrect: true },
        ...q.incorrect_answers.map((incorrect) => ({
          text: incorrect,
          isCorrect: false,
        })),
      ];
      return {
        ...q,
        options: useShuffleQuestion(formattedOptions),
      };
    });
  },
  { immediate: true },
);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null);

// Store outcome when an answer is submitted
const handleNextQuestion = (eventData) => {
  // Record true/false for this question
  answersHistory.value.push(eventData.isCorrect);

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    isGameFinished.value = true;
  }
};
</script>

<template>
  <div class="min-h-screen max-w-full overflow-x-hidden bg-white flex flex-col">
    <!-- Top Progress Bar -->
    <div class="w-full h-1.5 bg-gray-100 overflow-hidden shrink-0">
      <div
        class="h-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all duration-500 ease-out"
        :style="{
          width: questions.length ? Math.min(((currentQuestionIndex + 1) / questions.length) * 100, 100) + '%' : '0%',
        }"
      />
    </div>

    <main class="flex-1 flex flex-col items-center px-6 py-10 w-full max-w-4xl mx-auto">
      <div v-if="!gameSetup">Redirecting to game setup...</div>
      <div v-else-if="pending">Loading your quiz...</div>
      <div v-else-if="error">Failed to load questions.</div>

      <div v-else-if="isGameFinished" class="text-center py-10">
        <h2 class="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p class="text-gray-600 mb-6">You scored {{ answersHistory.filter(Boolean).length }} / {{ questions.length }}</p>
        <NuxtLink to="/" class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition"> Play Again </NuxtLink>
      </div>

      <QuestionCard
        v-else-if="currentQuestion"
        :key="currentQuestionIndex"
        :question="currentQuestion"
        :questionIndex="currentQuestionIndex"
        :questionsLength="questions.length"
        :answersHistory="answersHistory"
        @submit="handleNextQuestion"
      />
    </main>
  </div>
</template>
