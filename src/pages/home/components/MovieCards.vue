<script setup>
import { useRouter } from "vue-router";
import { useUserContext } from "../../../context/UserContext";

const props = defineProps({
  movies: { type: Array, default: () => [] },
  onViewMovie: Function
});

const { isAuthenticated } = useUserContext();
const router = useRouter();

function handleView(movie) {
  if (props.onViewMovie) {
    props.onViewMovie(movie);
  } else {
    router.push(`/movie/${movie._id}`);
  }
}
</script>

<template>
  <div v-if="!movies.length" class="text-center py-16 px-4 bg-white border border-slate-200 rounded-3xl shadow-xs">
    <div class="text-4xl mb-3">🎞️</div>
    <h3 class="text-base font-semibold text-slate-800">No Movies Found</h3>
    <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">
      There are currently no movies available in this catalog or matching your filters.
    </p>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="movie in movies"
      :key="movie._id"
      class="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
    >
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 tracking-wide uppercase">
            {{ movie.genre || "General" }}
          </span>
          <span class="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {{ movie.year || "N/A" }}
          </span>
        </div>
        <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {{ movie.title }}
        </h3>
        <p class="text-xs text-blue-600 font-medium mt-1 mb-3 flex items-center gap-1.5">
          <span class="text-slate-400">Director:</span>
          <span>{{ movie.director || "Unknown" }}</span>
        </p>
        <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {{ movie.description || "No description available for this movie." }}
        </p>
      </div>
      <div class="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div class="text-[11px] text-slate-400 flex items-center gap-1">
          <span>💬</span>
          <span>{{ movie.comments?.length || 0 }} comments</span>
        </div>
        <button
          v-if="isAuthenticated()"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 group-hover:scale-[1.02]"
          @click="handleView(movie)"
        >
          <span>View Movie</span>
          <span>→</span>
        </button>
        <button
          v-else
          class="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
          @click="router.push('/auth')"
        >
          Sign in to view
        </button>
      </div>
    </div>
  </div>
</template>
