<script setup>
const props = defineProps({
  movies: { type: Array, default: () => [] },
  loading: Boolean,
  error: String,
  onRetry: Function,
  onOpenAdd: Function,
  onOpenEdit: Function,
  onOpenDelete: Function,
  onOpenComments: Function
});
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
    <div v-if="props.loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-xs text-slate-500">Loading catalog data...</p>
    </div>
    <div v-else-if="props.error" class="text-center py-16 px-4">
      <p class="text-rose-600 text-xs mb-3">{{ props.error }}</p>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
        @click="props.onRetry"
      >
        Retry
      </button>
    </div>
    <div v-else-if="props.movies.length === 0" class="text-center py-20 px-4">
      <div class="text-3xl mb-2">🎞️</div>
      <h3 class="text-sm font-semibold text-slate-800">No Movies in Catalog</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">
        Click &quot;Add Movie&quot; above to create your first movie entry.
      </p>
      <button
        class="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
        @click="props.onOpenAdd"
      >
        + Add Movie
      </button>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <th class="py-3.5 px-4">Title</th>
            <th class="py-3.5 px-4">Director</th>
            <th class="py-3.5 px-4">Year</th>
            <th class="py-3.5 px-4">Genre</th>
            <th class="py-3.5 px-4 hidden md:table-cell">Description</th>
            <th class="py-3.5 px-4 text-center">Comments</th>
            <th class="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="movie in props.movies" :key="movie._id" class="hover:bg-blue-50/40 transition-colors group">
            <td class="py-3.5 px-4 font-bold text-slate-900">{{ movie.title }}</td>
            <td class="py-3.5 px-4 text-slate-700">{{ movie.director }}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">{{ movie.year }}</td>
            <td class="py-3.5 px-4">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {{ movie.genre || "General" }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
              {{ movie.description || "—" }}
            </td>
            <td class="py-3.5 px-4 text-center">
              <button
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                @click="props.onOpenComments(movie)"
              >
                <span>💬</span>
                <span class="font-mono text-[11px] font-bold text-blue-700">{{ movie.comments?.length || 0 }}</span>
              </button>
            </td>
            <td class="py-3.5 px-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-all cursor-pointer"
                  title="Edit Movie"
                  @click="props.onOpenEdit(movie)"
                >
                  Edit
                </button>
                <button
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-all cursor-pointer"
                  title="Delete Movie"
                  @click="props.onOpenDelete(movie)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
