import apiUser from "./apiUser";

export const uploadService = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiUser.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await apiUser.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
