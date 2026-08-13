<template>
  <header class="flex border-b border-gray-100 px-6 py-4">
    <div class="max-w-2xl mx-auto flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center shadow-sm">
        <span class="text-white text-lg">❓</span>
      </div>
      <span class="text-xl font-bold text-gray-900"> Trivio </span>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </div>
  </header>
  <slot></slot>
</template>
