import apiUser from "./apiUser";

export const blogService = {
  getAllBlogs: async (params = {}) => {
    const response = await apiUser.get("/user/blogs", { params });
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await apiUser.get(`/user/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data) => {
    const response = await apiUser.post("/user/blogs", data);
    return response.data;
  },

  likeBlog: async (id) => {
    const response = await apiUser.post(`/user/blogs/${id}/like`);
    return response.data;
  },

  addComment: async (id, content) => {
    const response = await apiUser.post(`/user/blogs/${id}/comments`, { content });
    return response.data;
  }
};
