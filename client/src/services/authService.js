import apiUser from "./apiUser.js";
const authService = {
    signup: async (email, password, fullName) => {
        try {
        const response = await apiUser.post("/auth/signup", {
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
        const response = await apiUser.post("/auth/signin", {
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
        const response = await apiUser.post("/auth/signout");
        return response.data;
    } catch (error) {
        throw error;
    }
 },
 getCurrentUser: async () => {
    try {
        const response = await apiUser.get("/user/me");
        return response.data.data.user;
    } catch (error) {
        throw error;
    }
 },
 forgotPassword: async (email) => {
    try {
        const response = await apiUser.post("/auth/forgot-password", {
            email
        });
        return response.data;
    } catch (error) {
        throw error;
    }
 },
 validateResetToken: async (token) => {
    try {
        const response = await apiUser.get("/auth/validate-reset-token", {
            params: { resetToken: token }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
 },
 resetPassword: async (token, password) => {
    try {
        const response = await apiUser.post("/auth/reset-password", {
            password
        }, {
            params: { token }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
 },
 changePassword: async (oldPassword, newPassword) => {
    try {
        const response = await apiUser.post("/user/change-password", {
            oldPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
 }
};
export default authService; 