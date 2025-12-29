import api from "./api.js";
const authService = {
    signup: async (email, password, fullName) => {
        try {
        const response = await api.post("/auth/signup", {
            email,
            password,
            fullName
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}, 
    signin: async (email, password) => {
        try {
        const response = await api.post("/auth/signin", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
 }, 
    signout: async () => {
        try {
        const response = await api.post("/auth/signout");
        return response.data;
    } catch (error) {
        throw error;
    }
 },
 getCurrentUser: async () => {
    try {
        const response = await api.get("/user/me");
        return response.data.data.user;
    } catch (error) {
        throw error;
    }
 }
};
export default authService; 