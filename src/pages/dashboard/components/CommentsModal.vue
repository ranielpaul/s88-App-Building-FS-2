<script setup>
const props = defineProps({
  isOpen: Boolean,
  movie: Object,
  comments: { type: Array, default: () => [] },
  onClose: Function
});
</script>

<template>
  <div v-if="props.isOpen && props.movie" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-xs text-slate-900">
      <button class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer" @click="props.onClose">
        ✕
      </button>
      <h3 class="text-lg font-bold text-slate-900 mb-1">
        Comments for &quot;{{ props.movie.title }}&quot;
      </h3>
      <p class="text-slate-500 mb-4">
        Total {{ props.comments.length }} {{ props.comments.length === 1 ? "comment" : "comments" }}
      </p>
      <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        <div v-if="props.comments.length === 0" class="py-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
          No comments yet for this movie.
        </div>
        <div
          v-for="(comment, index) in props.comments"
          v-else
          :key="comment._id || index"
          class="p-3 bg-slate-50 border border-slate-200 rounded-xl"
        >
          <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span class="font-semibold text-blue-600">
              {{ comment.userId ? `User (${comment.userId.slice(-6)})` : "Movie Fan" }}
            </span>
          </div>
          <p class="text-slate-700">{{ comment.comment || comment.text || JSON.stringify(comment) }}</p>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          @click="props.onClose"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
