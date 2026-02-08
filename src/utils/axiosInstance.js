import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // 🔥 match backend logs
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ALWAYS attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ OPTIONAL: handle expired token safely (NO SIDE EFFECTS)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired or invalid");
      // ❌ Do NOT redirect or clear storage (to avoid breaking app)
    }
    return Promise.reject(error);
  }
);

export default instance;
