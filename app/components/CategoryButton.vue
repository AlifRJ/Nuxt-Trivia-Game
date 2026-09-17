<script setup>
const props = defineProps({
  data: {
    type: Object,
  },
  isActive: Boolean,
});

const buttonClasses = computed(() => {
  return props.isActive ? "bg-emerald-500 border-emerald-500 text-white shadow-md scale-[1.04]" : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600";
});
</script>

<template>
  <button :class="buttonClasses" class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-150">
    <span>{{ data.icon }}</span>
    <span>{{ data.title }}</span>
  </button>
</template>
