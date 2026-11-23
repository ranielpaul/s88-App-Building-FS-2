import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || "https://movieapp-api-lms1.onrender.com"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
