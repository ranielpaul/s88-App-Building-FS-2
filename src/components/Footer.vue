<template>
  <footer class="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-base">🎬</span>
        <span class="font-semibold text-slate-800">MovieApp</span>
        <span class="text-slate-400">| Full Stack MEVN Application</span>
      </div>
      <p class="text-slate-400 text-center">
        &copy; {{ new Date().getFullYear() }} MovieApp. All rights reserved.
      </p>
    </div>
  </footer>
</template>
