import { ref, computed } from "vue";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

// Set global axios defaults for cookie-based auth
axios.defaults.withCredentials = true;

interface User {
  _id: string;
  name: string;
  username: string;
}

const user = ref<User | null>(
  localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
);

export const useAuthStore = () => {
  const setUser = (userData: User | null) => {
    user.value = userData;
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  return {
    user: currentUser,
    isAuthenticated,
    login,
    logout,
    setUser,
  };
};
