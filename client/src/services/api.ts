// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://books-challenge-api.onrender.com", // tu URL de Render/Heroku
});

// Interceptor para añadir el token JWT si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
