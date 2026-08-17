<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  pending: Boolean,
  error: String,
  questionsLength: Number,
  questionIndex: Number,
  answersHistory: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit"]);

const selectedOptionIndex = ref(null);
const isSubmitted = ref(false);

const selectOption = (index) => {
  if (isSubmitted.value) return;
  selectedOptionIndex.value = index;
};

const handleSubmit = () => {
  if (selectedOptionIndex.value === null || isSubmitted.value) return;

  isSubmitted.value = true;
  const chosenOption = props.question.options[selectedOptionIndex.value];

  setTimeout(() => {
    emit("submit", {
      questionIndex: props.questionIndex,
      selectedOption: chosenOption,
      isCorrect: chosenOption.isCorrect,
    });
  }, 1200);
};

const getOptionClasses = (index, option) => {
  const isSelected = selectedOptionIndex.value === index;

  if (!isSubmitted.value) {
    if (isSelected) {
      return "border-sky-500 bg-sky-50/50 text-sky-900 shadow-sm";
    }
    return "border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/50";
  }

  if (option.isCorrect) {
    return "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
  }

  if (isSelected && !option.isCorrect) {
    return "border-rose-500 bg-rose-50 text-rose-900 font-semibold";
  }

  return "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
};

// Helper function to resolve dot background colors
const getDotClass = (dotIndex) => {
  // Current active question
  if (dotIndex === props.questionIndex) {
    return "w-6 bg-sky-500";
  }

  // Answered questions (check history for true/false)
  if (dotIndex < props.questionIndex) {
    const isCorrect = props.answersHistory[dotIndex];
    return isCorrect ? "w-2 bg-emerald-500" : "w-2 bg-rose-500";
  }

  // Future questions
  return "w-2 bg-gray-200";
};

const difficultyBadgeClass = computed(() => {
  switch (props.question.difficulty?.toLowerCase()) {
    case "easy":
      return "bg-emerald-100 text-emerald-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "hard":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
});
</script>

<template>
  <div class="w-full max-w-2xl flex flex-col items-center">
    <!-- Header -->
    <div class="w-full flex items-center justify-between mb-6">
      <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest"> Question {{ questionIndex + 1 }} / {{ questionsLength }} </span>
      <span class="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" :class="difficultyBadgeClass">
        {{ question.difficulty }}
      </span>
    </div>

    <!-- Question text -->
    <div class="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200 min-h-[120px] flex items-center">
      <h2 v-html="question.question" class="text-2xl font-bold text-gray-900 leading-snug break-words [overflow-wrap:anywhere]"></h2>
    </div>

    <!-- Options -->
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
      <button
        v-for="(option, oIndex) in question.options"
        :key="oIndex"
        @click="selectOption(oIndex)"
        :disabled="isSubmitted"
        class="relative rounded-xl border-2 p-4 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between"
        :class="getOptionClasses(oIndex, option)"
      >
        <div class="flex items-center space-x-3 pr-6">
          <span
            class="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 transition-colors"
            :class="[selectedOptionIndex === oIndex && !isSubmitted ? 'bg-sky-500 text-white' : 'bg-gray-100 border border-gray-200 text-gray-500']"
          >
            {{ String.fromCharCode(65 + oIndex) }}
          </span>
          <span v-html="option.text"></span>
        </div>

        <template v-if="isSubmitted">
          <span v-if="option.isCorrect" class="text-emerald-600 font-bold text-base">✓</span>
          <span v-else-if="selectedOptionIndex === oIndex" class="text-rose-500 font-bold text-base">✕</span>
        </template>
      </button>
    </div>

    <!-- Submit Button -->
    <div class="w-full flex justify-end">
      <button
        @click="handleSubmit"
        :disabled="selectedOptionIndex === null || isSubmitted"
        class="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 active:scale-95"
      >
        <span v-if="isSubmitted">Checking...</span>
        <span v-else>Submit Answer</span>
      </button>
    </div>

    <!-- Dots Progress Bar -->
    <div class="flex justify-center gap-1.5 mt-8">
      <div v-for="i in questionsLength" :key="i" class="h-2 rounded-full transition-all duration-300" :class="getDotClass(i - 1)"></div>
    </div>
  </div>
</template>
