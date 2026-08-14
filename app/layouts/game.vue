<template>
  <header class="border-b border-gray-100 px-6 py-3">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center">
          <span class="text-white text-sm">❓</span>
        </div>
        <span class="font-bold text-gray-900 text-sm">Category</span>
      </div>
      <div class="flex items-center gap-4">
        <!-- <ScoreBadge score="{score}" /> -->
        <!-- <TimerRing timeLeft="{timeLeft}" total="{cfg.time}" /> -->
      </div>
    </div>
  </header>
  <slot></slot>
</template>
