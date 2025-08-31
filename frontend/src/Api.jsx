// api.js
import axios from "axios";
import { toast } from "react-toastify";
import{useAuth} from "./Context/AuthContext"

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // ✅ no hook here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiRequest = async (method, endpoint, body = null) => {
  try {
    const config = { method, url: endpoint };
    if (body !== null) {
      config.data = body; // only add data if body is not null
    }
    const response = await api(config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "API Error";
    toast.error(message);
    throw error.response?.data || { message };
  }
};



