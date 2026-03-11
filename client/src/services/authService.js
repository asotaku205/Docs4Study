import apiUser from "./apiUser.js";
const authService = {
    signup: async (email, password, fullName) => {
        const response = await apiUser.post("/auth/signup", {
            email,
            password,
            fullName
        });
        return response.data;
    }, 
    signin: async (email, password) => {
        const response = await apiUser.post("/auth/signin", {
            email,
            password
        });
        return response.data;
    }, 
    signout: async () => {
        const response = await apiUser.post("/auth/signout");
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await apiUser.get("/user/me");
        return response.data.data.user;
    },
    forgotPassword: async (email) => {
        const response = await apiUser.post("/auth/forgot-password", {
            email
        });
        return response.data;
    },
    validateResetToken: async (token) => {
        const response = await apiUser.get("/auth/validate-reset-token", {
            params: { resetToken: token }
        });
        return response.data;
    },
    resetPassword: async (token, password) => {
        const response = await apiUser.post("/auth/reset-password", {
            password
        }, {
            params: { token }
        });
        return response.data;
    },
    changePassword: async (oldPassword, newPassword) => {
        const response = await apiUser.post("/user/change-password", {
            oldPassword,
            newPassword
        });
        return response.data;
    }
};
export default authService;