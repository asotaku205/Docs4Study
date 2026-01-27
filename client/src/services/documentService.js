import apiUser from "./apiUser";

export const documentService = {
  getAllDocuments: async (params = {}) => {
    const response = await apiUser.get("/user/documents", { params });
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await apiUser.get(`/user/documents/${id}`);
    return response.data;
  },

  createDocument: async (data) => {
    const response = await apiUser.post("/user/documents", data);
    return response.data;
  },

  likeDocument: async (id) => {
    const response = await apiUser.post(`/user/documents/${id}/like`);
    return response.data;
  },

  addComment: async (id, content) => {
    const response = await apiUser.post(`/user/documents/${id}/comments`, { content });
    return response.data;
  }
};
