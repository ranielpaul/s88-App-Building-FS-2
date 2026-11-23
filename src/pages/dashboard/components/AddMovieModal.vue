<script setup>
import { reactive } from "vue";

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  onSubmit: Function,
  submitting: Boolean
});

const formData = reactive({
  title: "",
  director: "",
  year: new Date().getFullYear(),
  genre: "",
  description: ""
});

function handleSubmit(event) {
  event.preventDefault();
  props.onSubmit({ ...formData });
}
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900">
      <button class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer" @click="props.onClose">
        ✕
      </button>
      <h3 class="text-xl font-bold text-slate-900 mb-1">Add New Movie</h3>
      <p class="text-xs text-slate-500 mb-6">Provide movie details to add to the public catalog.</p>
      <form class="space-y-4 text-xs" @submit="handleSubmit">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Title *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="e.g. Inception"
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Director *</label>
            <input
              v-model="formData.director"
              type="text"
              required
              placeholder="e.g. Christopher Nolan"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Year *</label>
            <input
              v-model="formData.year"
              type="number"
              required
              min="1888"
              max="2100"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Genre *</label>
          <input
            v-model="formData.genre"
            type="text"
            required
            placeholder="e.g. Action, Sci-Fi, Drama"
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Short synopsis of the film..."
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <div class="flex items-center justify-end gap-2 pt-3">
          <button type="button" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer" @click="props.onClose">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="props.submitting"
            class="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            {{ props.submitting ? "Adding..." : "Add Movie" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
