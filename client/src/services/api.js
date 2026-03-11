import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL + "/admin",
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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
        const rs = await refreshAPI.post("/auth/refresh");
        const { accessToken } = rs.data.data;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (_error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  restore: (id) => api.post(`/users/${id}/restore`),
};

export const coursesAPI = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  restore: (id) => api.post(`/courses/${id}/restore`),
};

export const documentsAPI = {
  getAll: (params) => api.get("/documents", { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post("/documents", data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  restore: (id) => api.post(`/documents/${id}/restore`),
};

export const ordersAPI = {
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
  restore: (id) => api.post(`/orders/${id}/restore`),
};

export const blogPostsAPI = {
  getAll: (params) => api.get("/blog-posts", { params }),
  getById: (id) => api.get(`/blog-posts/${id}`),
  create: (data) => api.post("/blog-posts", data),
  update: (id, data) => api.put(`/blog-posts/${id}`, data),
  delete: (id) => api.delete(`/blog-posts/${id}`),
  restore: (id) => api.post(`/blog-posts/${id}/restore`),
};

export const categoriesAPI = {
  getAll: (params) => api.get("/categories", { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  restore: (id) => api.post(`/categories/${id}/restore`),
};

export default api;