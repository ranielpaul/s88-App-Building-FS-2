<script setup>
import { computed, onMounted, onUnmounted, reactive, watch } from "vue";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer.vue";
import MovieCards from "./components/MovieCards.vue";
import MovieDetails from "./components/MovieDetails.vue";
import api from "../../api";

const state = reactive({
  movies: [],
  loading: true,
  error: "",
  searchQuery: "",
  selectedGenre: "All",
  activeMovie: null,
  reloadKey: 0
});
let activeRequest = 0;

const genres = computed(() => [
  "All",
  ...new Set(state.movies.map((movie) => movie.genre).filter(Boolean))
]);

const filteredMovies = computed(() =>
  state.movies.filter((movie) => {
    const query = state.searchQuery.toLowerCase();
    const matchesSearch =
      movie.title?.toLowerCase().includes(query) ||
      movie.director?.toLowerCase().includes(query) ||
      movie.description?.toLowerCase().includes(query);
    const matchesGenre =
      state.selectedGenre === "All" ||
      movie.genre?.toLowerCase() === state.selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  })
);

async function fetchMovies() {
  const requestId = ++activeRequest;
  state.loading = true;
  state.error = "";
  try {
    const response = await api.get("/movies/getMovies");
    if (requestId !== activeRequest) return;
    state.movies =
      response.data?.movies || (Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    if (requestId !== activeRequest) return;
    console.error("Failed to fetch movies:", error);
    state.error = "Unable to load movies right now. Please try again later.";
  } finally {
    if (requestId === activeRequest) state.loading = false;
  }
}

watch(() => state.reloadKey, fetchMovies);
onMounted(fetchMovies);
onUnmounted(() => {
  activeRequest += 1;
});

function viewMovie(movie) {
  state.activeMovie = movie;
}

function closeMovie() {
  state.activeMovie = null;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
    <Navbar />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <section class="relative overflow-hidden rounded-3xl border border-slate-300 p-8 sm:p-12 mb-10 shadow-sm">
        <div class="max-w">
          <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            🎬 Explore Movies & Comments
          </h1>
          <div class="relative max-w">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
              🔍
            </span>
            <input
              v-model="state.searchQuery"
              type="text"
              placeholder="Search by title, director, or keyword..."
              class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            />
            <button
              v-if="state.searchQuery"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              @click="state.searchQuery = ''"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <div class="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Movie Catalog</span>
            <span class="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {{ filteredMovies.length }} {{ filteredMovies.length === 1 ? "movie" : "movies" }}
            </span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Select any movie card to view detailed synopsis and audience comments
          </p>
        </div>
        <div v-if="genres.length > 1" class="flex flex-wrap items-center gap-1.5 max-w">
          <button
            v-for="genre in genres"
            :key="genre"
            :class="[
              'px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer',
              state.selectedGenre === genre
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
            ]"
            @click="state.selectedGenre = genre"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <div v-if="state.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-xs text-slate-500">Loading catalog...</p>
      </div>
      <div v-else-if="state.error" class="text-center py-16 px-4 bg-rose-50 border border-rose-200 rounded-3xl">
        <p class="text-rose-600 text-sm mb-4">{{ state.error }}</p>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          @click="state.reloadKey++"
        >
          Try Again
        </button>
      </div>
      <MovieCards v-else :movies="filteredMovies" :on-view-movie="viewMovie" />

      <MovieDetails
        v-if="state.activeMovie"
        :movie="state.activeMovie"
        :on-close="closeMovie"
      />
    </main>
    <Footer />
  </div>
</template>
