<script setup>
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserContext } from "../../context/UserContext";
import api from "../../api";
import notyf from "../../utils/notyf";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer.vue";

const router = useRouter();
const user = useUserContext();
const state = reactive({
  isRegister: false,
  form: { email: "", password: "" },
  loading: false,
  error: ""
});

watch(
  () => user.token,
  (token) => {
    if (token) router.push("/");
  },
  { immediate: true }
);

async function handleSubmit(event) {
  event.preventDefault();
  state.error = "";
  if (!state.form.email || !state.form.password) {
    state.error = "Please fill in both email and password.";
    return;
  }
  if (state.isRegister && state.form.password.length < 8) {
    state.error = "Password must be at least 8 characters long.";
    return;
  }

  state.loading = true;
  try {
    if (state.isRegister) {
      const response = await api.post("/users/register", state.form);
      notyf.success(response.data?.message || "Registered successfully! Logging you in...");
      try {
        const loginResponse = await api.post("/users/login", state.form);
        const token = loginResponse.data.access || loginResponse.data.token;
        if (token) {
          user.setNewToken(token);
          notyf.success("Logged in successfully!");
          router.push("/");
          return;
        }
        state.isRegister = false;
      } catch {
        state.isRegister = false;
      }
    } else {
      const response = await api.post("/users/login", state.form);
      const token = response.data.access || response.data.token;
      if (token) {
        user.setNewToken(token);
        notyf.success("Logged in successfully!");
        router.push("/");
      } else {
        state.error = "No access token received from server.";
      }
    }
  } catch (error) {
    console.error("Auth error:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      "Authentication failed. Please check your credentials.";
    state.error = message;
    notyf.error(message);
  } finally {
    state.loading = false;
  }
}

function selectMode(register) {
  state.isRegister = register;
  state.error = "";
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main class="flex-1 flex items-center justify-center p-4 py-12">
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        <div class="text-center mb-8">
          <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
            <span class="text-2xl">🎬</span>
          </div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">
            {{ state.isRegister ? "Create your account" : "Welcome back" }}
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            {{ state.isRegister
              ? "Sign up to explore, view, and comment on movies"
              : "Sign in with your email and password" }}
          </p>
        </div>
        <div class="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            :class="[
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              !state.isRegister
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            ]"
            @click="selectMode(false)"
          >
            Sign In
          </button>
          <button
            type="button"
            :class="[
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              state.isRegister
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            ]"
            @click="selectMode(true)"
          >
            Register
          </button>
        </div>
        <div v-if="state.error" class="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <span class="text-base leading-none">⚠️</span>
          <span>{{ state.error }}</span>
        </div>
        <form class="space-y-4" @submit="handleSubmit">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              v-model="state.form.email"
              type="email"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              v-model="state.form.password"
              type="password"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              placeholder="••••••••"
            />
            <p v-if="state.isRegister" class="text-[11px] text-slate-500 mt-1">
              Must be at least 8 characters long.
            </p>
          </div>
          <button
            type="submit"
            :disabled="state.loading"
            class="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all mt-2 cursor-pointer"
          >
            <span v-if="state.loading" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
            <template v-else>{{ state.isRegister ? "Create Account" : "Sign In" }}</template>
          </button>
        </form>
        <div class="mt-6 text-center text-xs text-slate-500">
          {{ state.isRegister ? "Already have an account?" : "Don't have an account yet?" }}
          <button
            type="button"
            class="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 cursor-pointer"
            @click="selectMode(!state.isRegister)"
          >
            {{ state.isRegister ? "Sign in instead" : "Register now" }}
          </button>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          <p>
            Admin demo: <code class="text-slate-600 font-medium">admin@mail.com</code> /
            <code class="text-slate-600 font-medium">admin123</code>
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
