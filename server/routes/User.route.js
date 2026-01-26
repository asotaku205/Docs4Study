import { Router } from "express";
import UserController from "../controller/User.controller.js";
import { protectedRoute } from "../middleware/Auth.middleware.js";
import adminDashboardController from "../controller/CRUDadmindashboard.controller.js";
const routerUser = Router();

routerUser.get('/me', protectedRoute, UserController.me);
routerUser.post('/change-password', protectedRoute, UserController.changePassword);

routerUser.get('/blogs', UserController.getAllBlogs);
routerUser.get('/blogs/:id', UserController.getBlogById);
routerUser.post('/blogs', protectedRoute, UserController.createBlog);
routerUser.post('/blogs/:id/like', UserController.likeBlog);
routerUser.post('/blogs/:id/comments', protectedRoute, UserController.addComment);

routerUser.get('/categories', adminDashboardController.getAllCategories);

export default routerUser;