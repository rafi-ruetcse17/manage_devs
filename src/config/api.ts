const API_BASE_URL = "https://manage-devs-backend.vercel.app";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  DAILY_NOTES: `${API_BASE_URL}/api/daily-notes`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
};
