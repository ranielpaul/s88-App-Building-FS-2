<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserContext } from "../context/UserContext";
import notyf from "../utils/notyf";

const userContext = useUserContext();
const user = computed(() => userContext.user);
const { clearToken, isAuthenticated } = userContext;
const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

function handleLogout() {
  clearToken();
  notyf.success("Logged out successfully");
  router.push("/");
  mobileMenuOpen.value = false;
}

function navLinkClass(path) {
  return `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
    route.path === path
      ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs"
      : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
  }`;
}

function mobileLinkClass(path) {
  return `block px-3 py-2 rounded-xl text-sm font-medium ${
    route.path === path
      ? "bg-blue-50 text-blue-700 font-semibold"
      : "text-slate-600 hover:bg-slate-100"
  }`;
}
</script>

<template>
  <nav class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span class="text-xl">🎬</span>
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Movie App
              </span>
              <span class="text-[10px] text-blue-600 font-semibold tracking-wider uppercase -mt-1">
                Catalog
              </span>
            </div>
          </RouterLink>
        </div>

        <div class="hidden md:flex items-center gap-2">
          <RouterLink to="/" :class="navLinkClass('/')">Movies Catalog</RouterLink>
          <RouterLink v-if="isAuthenticated() && user?.isAdmin" to="/dashboard" :class="navLinkClass('/dashboard')">
            Admin Dashboard
          </RouterLink>
        </div>

        <div class="hidden md:flex items-center gap-3">
          <div v-if="isAuthenticated()" class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-700">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-medium">{{ user?.email }}</span>
              <span v-if="user?.isAdmin" class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                ADMIN
              </span>
            </div>
            <button
              class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
          <RouterLink
            v-else
            to="/auth"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
          >
            Sign In / Register
          </RouterLink>
        </div>

        <div class="flex md:hidden">
          <button
            class="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
      <RouterLink to="/" :class="mobileLinkClass('/')" @click="mobileMenuOpen = false">
        Movies Catalog
      </RouterLink>
      <RouterLink
        v-if="isAuthenticated() && user?.isAdmin"
        to="/dashboard"
        :class="mobileLinkClass('/dashboard')"
        @click="mobileMenuOpen = false"
      >
        Admin Dashboard
      </RouterLink>
      <div class="pt-3 border-t border-slate-200">
        <div v-if="isAuthenticated()" class="space-y-2">
          <div class="text-xs text-slate-500 px-3">
            Signed in as <span class="font-semibold text-slate-900">{{ user?.email }}</span>
            <span v-if="user?.isAdmin" class="text-blue-600 font-bold ml-1">(Admin)</span>
          </div>
          <button
            class="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-xs"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
        <RouterLink
          v-else
          to="/auth"
          class="block text-center w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
          @click="mobileMenuOpen = false"
        >
          Sign In / Register
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
