import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/admin";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;

