<script setup>
const props = defineProps({
  score: {
    type: Array,
    default: () => [],
  },
});

const totalScore = computed(() => {
  return (props.score || []).reduce((acc, curr) => acc + curr, 0);
});
</script>
<template>
  <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
    <span class="text-emerald-600 text-sm font-medium"> Score </span>
    <span class="text-emerald-700 text-lg font-bold"> {{ totalScore }} </span>
  </div>
</template>
