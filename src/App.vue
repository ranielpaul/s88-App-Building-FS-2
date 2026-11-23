<script>
import { defineComponent, provide, reactive } from "vue";
import { RouterView, createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./context/UserContext";

import Home from "./pages/home/Home.vue";
import Auth from "./pages/auth/Auth.vue";
import Dashboard from "./pages/dashboard/Dashboard.vue";
import MovieDetails from "./pages/home/components/MovieDetails.vue";

function decodeToken(token) {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/auth", component: Auth },
    { path: "/login", component: Auth },
    { path: "/register", component: Auth },
    { path: "/dashboard", component: Dashboard },
    { path: "/addJob", component: Dashboard },
    { path: "/admin", component: Dashboard },
    { path: "/movie/:id", component: MovieDetails },
    { path: "/movies/:id", component: MovieDetails },
    { path: "/:pathMatch(.*)*", redirect: "/" }
  ]
});

export default defineComponent({
  components: { RouterView },
  setup() {
    const token = localStorage.getItem("token");
    const user = reactive({
      token,
      profile: decodeToken(token)
    });

    provide(UserContext, {
      get token() {
        return user.token;
      },
      get user() {
        return user.profile;
      },
      setNewToken(newToken) {
        user.token = newToken;
        user.profile = decodeToken(newToken);
        if (newToken) {
          localStorage.setItem("token", newToken);
        } else {
          localStorage.removeItem("token");
        }
      },
      clearToken() {
        user.token = null;
        user.profile = null;
        localStorage.removeItem("token");
      },
      isAuthenticated() {
        return !!user.token;
      },
      get isAdmin() {
        return !!user.profile?.isAdmin;
      }
    });

    return {};
  }
});
</script>

<template>
  <RouterView />
</template>
