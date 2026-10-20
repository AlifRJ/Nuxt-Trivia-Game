<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  placeholder: String,
  type: { type: String, default: "text" },
  required: Boolean,
  error: String,
});

defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Label -->
    <label v-if="label" :for="id" class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2"> {{ label }} <span v-if="required" class="text-red-500">*</span> </label>

    <!-- Input -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :class="['w-full px-4 py-3 rounded-xl border-2 text-gray-900 text-sm font-medium outline-none transition-all', error ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-emerald-400 focus:bg-white']"
    />

    <!-- Pesan Error -->
    <p v-if="error" class="text-rose-500 text-xs mt-1.5 font-medium">
      {{ error }}
    </p>
  </div>
</template>
