import apiUser from "./apiUser";

export const searchService = {
  search: async (params = {}) => {
    const response = await apiUser.get("/user/search", { params });
    return response.data;
  },
};
