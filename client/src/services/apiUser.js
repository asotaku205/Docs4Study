import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const apiUser = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiUser.interceptors.request.use(
  (config) => {
    // Token giờ được gửi tự động qua cookie (HttpOnly)
    // Vẫn kiểm tra localStorage cho backward compatibility
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

apiUser.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Tạo axios instance mới cho refresh để tránh vòng lặp
          const refreshAPI = axios.create({
            baseURL: API_URL,
            withCredentials: true,
          });
          const rs = await refreshAPI.post("/auth/refresh");
          // Token mới giờ được lưu trong cookie tự động
          // Vẫn lưu vào localStorage cho backward compatibility
          const { accessToken } = rs.data.data;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            apiUser.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return apiUser(originalRequest);
        } catch (_error) {
          // Clear token và redirect nếu refresh thất bại
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/auth";
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default apiUser;