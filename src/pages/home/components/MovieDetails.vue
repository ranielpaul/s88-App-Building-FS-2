<script setup>
import { onUnmounted, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserContext } from "../../../context/UserContext";
import api from "../../../api";
import notyf from "../../../utils/notyf";

const props = defineProps({
  movie: Object,
  onClose: Function
});

const route = useRoute();
const router = useRouter();
const userContext = useUserContext();
const user = computed(() => userContext.user);
const isAuthenticated = userContext.isAuthenticated;
const state = reactive({
  movie: props.movie || null,
  comments: props.movie?.comments || [],
  commentText: "",
  loading: !props.movie,
  submittingComment: false,
  error: ""
});
let activeRequest = 0;
const movieId = () => props.movie?._id || route.params.id;

async function loadMovie() {
  const requestId = ++activeRequest;
  state.movie = props.movie || null;
  state.comments = props.movie?.comments || [];
  state.error = "";
  state.loading = !props.movie;
  const id = movieId();
  if (!id || props.movie) return;
  try {
    const response = await api.get(`/movies/getMovie/${id}`);
    if (requestId !== activeRequest) return;
    const data = response.data?.movie || response.data;
    state.movie = data;
    state.comments = data?.comments || [];
  } catch (error) {
    if (requestId !== activeRequest) return;
    console.error("Error fetching movie:", error);
    state.error = "Failed to load movie details.";
  } finally {
    if (requestId === activeRequest) state.loading = false;
  }
}

async function loadComments() {
  const id = movieId();
  if (!id || !isAuthenticated()) return;
  try {
    const response = await api.get(`/movies/getComments/${id}`);
    if (response.data?.comments) state.comments = response.data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

watch(
  [() => props.movie, () => route.params.id],
  () => {
    loadMovie();
    loadComments();
  },
  { immediate: true }
);
onUnmounted(() => {
  activeRequest += 1;
});

async function handleAddComment(event) {
  event.preventDefault();
  const comment = state.commentText.trim();
  if (!comment) return;
  if (user.value?.isAdmin) {
    notyf.error("Admins cannot submit comments (Server restriction).");
    return;
  }

  state.submittingComment = true;
  try {
    const response = await api.patch(`/movies/addComment/${movieId()}`, { comment });
    notyf.success("Comment posted successfully!");
    state.commentText = "";
    if (response.data?.updatedMovie?.comments) {
      state.comments = response.data.updatedMovie.comments;
    } else {
      await loadComments();
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    try {
      const response = await api.post(`/movies/addComment/${movieId()}`, { comment });
      notyf.success("Comment posted successfully!");
      state.commentText = "";
      if (response.data?.updatedMovie?.comments) {
        state.comments = response.data.updatedMovie.comments;
      }
    } catch (postError) {
      const message =
        postError.response?.data?.message ||
        postError.response?.data?.error ||
        "Failed to submit comment.";
      notyf.error(message);
    }
  } finally {
    state.submittingComment = false;
  }
}

function handleClose() {
  if (props.onClose) {
    props.onClose();
  } else {
    router.push("/");
  }
}
</script>

<template>
  <div v-if="state.loading" class="flex items-center justify-center p-12">
    <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
  <div v-else-if="state.error || !state.movie" class="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
    <p class="text-rose-600 text-sm mb-4">{{ state.error || "Movie not found." }}</p>
    <button
      class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
      @click="handleClose"
    >
      Back to Movies
    </button>
  </div>
  <div
    v-else
    :class="props.onClose
      ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto'
      : 'min-h-screen bg-slate-50 text-slate-900 flex flex-col py-8 px-4'"
  >
    <div v-if="!props.onClose" class="max-w-2xl mx-auto w-full mb-4">
      <button
        class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        @click="handleClose"
      >
        ← Back to Catalog
      </button>
    </div>
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto shadow-xl relative text-slate-900">
      <button
        class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition-colors cursor-pointer"
        aria-label="Close"
        @click="handleClose"
      >
        ✕
      </button>
      <div class="flex flex-wrap items-center gap-2 mb-3 pr-8">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
          {{ state.movie.genre || "General" }}
        </span>
        <span class="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Year: {{ state.movie.year }}
        </span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
        {{ state.movie.title }}
      </h1>
      <div class="flex items-center gap-1.5 text-xs text-blue-600 font-medium mb-6">
        <span class="text-slate-500">Directed by</span>
        <span class="text-slate-800 font-semibold">{{ state.movie.director }}</span>
      </div>
      <div class="mb-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</h4>
        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {{ state.movie.description || "No description provided." }}
        </p>
      </div>
      <div class="pt-5 border-t border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Comments</span>
            <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-mono font-semibold border border-blue-200">
              {{ state.comments.length }}
            </span>
          </h4>
        </div>
        <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-5">
          <div v-if="state.comments.length === 0" class="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
            <p class="text-xs text-slate-400">No comments yet. Share your thoughts!</p>
          </div>
          <div
            v-for="(comment, index) in state.comments"
            v-else
            :key="comment._id || index"
            class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-1"
          >
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span class="font-semibold text-blue-600 flex items-center gap-1">
                <span>👤</span>
                <span>{{ comment.userId ? `User (${comment.userId.slice(-6)})` : "Movie Fan" }}</span>
              </span>
            </div>
            <p class="text-xs text-slate-700 leading-normal">
              {{ comment.comment || comment.text || JSON.stringify(comment) }}
            </p>
          </div>
        </div>
        <div v-if="isAuthenticated() && user?.isAdmin" class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          ℹ️ Logged in as Admin. Commenting is reserved for regular moviegoers.
        </div>
        <form v-else-if="isAuthenticated()" class="flex gap-2" @submit="handleAddComment">
          <input
            v-model="state.commentText"
            type="text"
            placeholder="Write a comment about this movie..."
            class="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <button
            type="submit"
            :disabled="state.submittingComment || !state.commentText.trim()"
            class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/20"
          >
            {{ state.submittingComment ? "Posting..." : "Post" }}
          </button>
        </form>
        <div v-else class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
          <span>Please </span>
          <button
            class="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700 cursor-pointer"
            @click="router.push('/auth')"
          >
            sign in
          </button>
          <span> to leave a comment.</span>
        </div>
      </div>
    </div>
  </div>
</template>
