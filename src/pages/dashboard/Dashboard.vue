<script setup>
import { computed, onMounted, reactive } from "vue";
import { RouterLink } from "vue-router";
import { useUserContext } from "../../context/UserContext";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer.vue";
import api from "../../api";
import notyf from "../../utils/notyf";

import MovieTable from "./components/MovieTable.vue";
import AddMovieModal from "./components/AddMovieModal.vue";
import EditMovieModal from "./components/EditMovieModal.vue";
import DeleteMovieModal from "./components/DeleteMovieModal.vue";
import CommentsModal from "./components/CommentsModal.vue";

const userContext = useUserContext();
const user = computed(() => userContext.user);
const isAuthenticated = userContext.isAuthenticated;
const state = reactive({
  movies: [],
  loading: true,
  error: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  showCommentsModal: false,
  selectedMovie: null,
  movieComments: [],
  submitting: false
});

async function fetchMovies() {
  state.loading = true;
  state.error = "";
  try {
    const response = await api.get("/movies/getMovies");
    state.movies =
      response.data?.movies || (Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    state.error = "Failed to load movies. Please check your connection.";
  } finally {
    state.loading = false;
  }
}

onMounted(fetchMovies);

async function handleAddMovie(formData) {
  if (!formData.title || !formData.director || !formData.genre) {
    notyf.error("Please fill in all required fields.");
    return;
  }
  state.submitting = true;
  try {
    await api.post("/movies/addMovie", {
      title: formData.title.trim(),
      director: formData.director.trim(),
      year: Number(formData.year),
      description: formData.description.trim(),
      genre: formData.genre
    });
    notyf.success("Movie added successfully!");
    state.showAddModal = false;
    await fetchMovies();
  } catch (error) {
    console.error("Add movie error:", error);
    notyf.error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add movie."
    );
  } finally {
    state.submitting = false;
  }
}

async function handleUpdateMovie(formData) {
  if (!state.selectedMovie) return;
  state.submitting = true;
  try {
    await api.patch(`/movies/updateMovie/${state.selectedMovie._id}`, {
      title: formData.title.trim(),
      director: formData.director.trim(),
      year: Number(formData.year),
      description: formData.description.trim(),
      genre: formData.genre
    });
    notyf.success("Movie updated successfully!");
    state.showEditModal = false;
    state.selectedMovie = null;
    await fetchMovies();
  } catch (error) {
    console.error("Update movie error:", error);
    notyf.error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update movie."
    );
  } finally {
    state.submitting = false;
  }
}

async function handleDeleteMovie() {
  if (!state.selectedMovie) return;
  state.submitting = true;
  try {
    await api.delete(`/movies/deleteMovie/${state.selectedMovie._id}`);
    notyf.success("Movie deleted successfully!");
    state.showDeleteModal = false;
    state.selectedMovie = null;
    await fetchMovies();
  } catch (error) {
    console.error("Delete movie error:", error);
    notyf.error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete movie."
    );
  } finally {
    state.submitting = false;
  }
}

async function handleOpenComments(movie) {
  state.selectedMovie = movie;
  state.showCommentsModal = true;
  state.movieComments = movie.comments || [];
  try {
    const response = await api.get(`/movies/getComments/${movie._id}`);
    if (response.data?.comments) state.movieComments = response.data.comments;
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

function openEdit(movie) {
  state.selectedMovie = movie;
  state.showEditModal = true;
}

function openDelete(movie) {
  state.selectedMovie = movie;
  state.showDeleteModal = true;
}
</script>

<template>
  <div v-if="!isAuthenticated() || !user?.isAdmin" class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-3xl mx-auto mb-4">
          🔒
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
        <p class="text-xs text-slate-500 mb-6 leading-relaxed">
          This dashboard is restricted to administrator accounts. Please sign in with an
          authorized admin account to manage movies.
        </p>
        <div class="space-y-3">
          <RouterLink to="/auth" class="block w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all">
            Sign In as Admin
          </RouterLink>
          <RouterLink to="/" class="block w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all">
            Back to Home Catalog
          </RouterLink>
        </div>
      </div>
    </main>
    <Footer />
  </div>

  <div v-else class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              Admin Panel
            </span>
            <span class="text-xs text-slate-500 font-mono">{{ state.movies.length }} Total Movies</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Movie Management Dashboard
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            View all catalog entries in table format, add new titles, update existing details, or remove movies.
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          @click="state.showAddModal = true"
        >
          <span class="text-base leading-none">+</span>
          <span>Add Movie</span>
        </button>
      </div>
      <MovieTable
        :movies="state.movies"
        :loading="state.loading"
        :error="state.error"
        :on-retry="fetchMovies"
        :on-open-add="() => state.showAddModal = true"
        :on-open-edit="openEdit"
        :on-open-delete="openDelete"
        :on-open-comments="handleOpenComments"
      />
    </main>
    <AddMovieModal
      :is-open="state.showAddModal"
      :on-close="() => state.showAddModal = false"
      :on-submit="handleAddMovie"
      :submitting="state.submitting"
    />
    <EditMovieModal
      :key="state.selectedMovie?._id || 'none'"
      :is-open="state.showEditModal"
      :movie="state.selectedMovie"
      :on-close="() => { state.showEditModal = false; state.selectedMovie = null; }"
      :on-submit="handleUpdateMovie"
      :submitting="state.submitting"
    />
    <DeleteMovieModal
      :is-open="state.showDeleteModal"
      :movie="state.selectedMovie"
      :on-close="() => { state.showDeleteModal = false; state.selectedMovie = null; }"
      :on-confirm="handleDeleteMovie"
      :submitting="state.submitting"
    />
    <CommentsModal
      :is-open="state.showCommentsModal"
      :movie="state.selectedMovie"
      :comments="state.movieComments"
      :on-close="() => { state.showCommentsModal = false; state.selectedMovie = null; }"
    />
  </div>
</template>
