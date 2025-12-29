import axios from "axios";
const API_URL = "http://localhost:5001/api";
const apiUser = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
apiUser.interceptors.request.use(
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
          const rs = await api.post("/auth/refresh");
          const { accessToken } = rs.data.data;
          localStorage.setItem("accessToken", accessToken);
          apiUser.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          return apiUser(originalRequest);
        } catch (_error) {
          return Promise.reject(_error);
        }
        }
    }
     return Promise.reject(error);
  }
);
export default apiUser;