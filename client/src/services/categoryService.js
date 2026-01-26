import apiUser from "./apiUser";

export const categoryService = {
  getAllCategories: async (params = {}) => {
    const response = await apiUser.get("/user/categories", { params });
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiUser.get(`/user/categories/${id}`);
    return response.data;
  }
};
