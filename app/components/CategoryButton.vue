<script setup>
const props = defineProps({
  data: {
    type: Object,
  },
  isActive: Boolean,
});

const buttonClasses = computed(() => {
  return props.isActive
    ? "from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400 ring-2 ring-offset-2 ring-emerald-400 scale-[1.02] shadow-md"
    : "from-sky-50 to-blue-50 border-sky-200 hover:border-sky-400 hover:scale-[1.01] hover:shadow-sm";
});
</script>

<template>
  <button :class="buttonClasses" class="relative rounded-2xl border-2 p-4 text-left transition-all duration-150 bg-gradient-to-br">
    <span class="text-2xl block mb-1">{{ data.icon }}</span>
    <span class="text-sm font-semibold text-gray-800">{{ data.title }}</span>
    <span v-if="isActive" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </button>
</template>
