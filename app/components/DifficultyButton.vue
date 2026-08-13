<script setup>
const props = defineProps({
  data: {
    type: Object,
  },
  isActive: Boolean,
});

const difficultyStyles = {
  easy: "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-offset-1 ring-current shadow-sm scale-[1.03]",
  medium: "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-offset-1 ring-current shadow-sm scale-[1.03]",
  hard: "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-offset-1 ring-current shadow-sm scale-[1.03]",
};

const buttonClasses = computed(() => {
  const baseInactive = "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100";

  if (props.isActive) {
    return difficultyStyles[props.data.type] || "";
  }

  return baseInactive;
});
</script>

<template>
  <button :class="buttonClasses" class="flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all duration-150 capitalize">
    <div>{{ data.type }}</div>
    <div class="text-xs font-normal opacity-70 mt-0.5">{{ data.time }}s • {{ data.points }}pts</div>
  </button>
</template>
