import { Router } from "express";
import UserController from "../controller/User.controller.js";
import { protectedRoute } from "../middleware/Auth.middleware.js";
import adminDashboardController from "../controller/CRUDadmindashboard.controller.js";
const routerUser = Router();

routerUser.get('/me', protectedRoute, UserController.me);
routerUser.get('/profile', protectedRoute, UserController.getMyProfile);
routerUser.put('/profile', protectedRoute, UserController.updateProfile);
routerUser.get('/profile/:id', UserController.getUserProfile);
routerUser.post('/change-password', protectedRoute, UserController.changePassword);

routerUser.get('/search', UserController.search);

routerUser.get('/blogs', UserController.getAllBlogs);
routerUser.get('/blogs/:id', UserController.getBlogById);
routerUser.post('/blogs', protectedRoute, UserController.createBlog);
routerUser.post('/blogs/:id/like', protectedRoute, UserController.likeBlog);
routerUser.post('/blogs/:id/comments', protectedRoute, UserController.addComment);

routerUser.get('/documents', UserController.getAllDocuments);
routerUser.get('/documents/:id', UserController.getDocumentById);
routerUser.post('/documents', protectedRoute, UserController.createDocument);
routerUser.post('/documents/:id/like', protectedRoute, UserController.likeDocument);
routerUser.post('/documents/:id/comments', protectedRoute, UserController.addDocumentComment);

routerUser.get('/categories', adminDashboardController.getAllCategories);
routerUser.get('/courses', adminDashboardController.getAllCourses);
routerUser.get('/courses/:id', adminDashboardController.getCourseById);
routerUser.post('/courses/:id/comments', protectedRoute, UserController.addCourseComment);

export default routerUser;