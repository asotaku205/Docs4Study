import axios from "axios";
const API_URL = "http://localhost:5001/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest._retry) {
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        const rs = await api.post("/auth/refresh");
        const { accessToken } = rs.data.data;
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (_error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = "/auth";
        }
        return Promise.reject(_error);
      }
    }
    
    return Promise.reject(error);
  }
);
export default api;
