import express from "express";
import adminDashboardController from "../controller/CRUDadmindashboard.controller.js";

const router = express.Router();

router.get("/users", adminDashboardController.getAllUsers);
router.get("/users/:id", adminDashboardController.getUserById);
router.post("/users", adminDashboardController.createUser);
router.put("/users/:id", adminDashboardController.updateUser);
router.delete("/users/:id", adminDashboardController.deleteUser);
router.post("/users/:id/restore", adminDashboardController.restoreUser);

router.get("/courses", adminDashboardController.getAllCourses);
router.get("/courses/:id", adminDashboardController.getCourseById);
router.post("/courses", adminDashboardController.createCourse);
router.put("/courses/:id", adminDashboardController.updateCourse);
router.delete("/courses/:id", adminDashboardController.deleteCourse);
router.post("/courses/:id/restore", adminDashboardController.restoreCourse);

router.get("/documents", adminDashboardController.getAllDocuments);
router.get("/documents/:id", adminDashboardController.getDocumentById);
router.post("/documents", adminDashboardController.createDocument);
router.put("/documents/:id", adminDashboardController.updateDocument);
router.delete("/documents/:id", adminDashboardController.deleteDocument);
router.post("/documents/:id/restore", adminDashboardController.restoreDocument);

router.get("/orders", adminDashboardController.getAllOrders);
router.get("/orders/:id", adminDashboardController.getOrderById);
router.post("/orders", adminDashboardController.createOrder);
router.put("/orders/:id", adminDashboardController.updateOrder);
router.delete("/orders/:id", adminDashboardController.deleteOrder);
router.post("/orders/:id/restore", adminDashboardController.restoreOrder);

router.get("/blog-posts", adminDashboardController.getAllBlogPosts);
router.get("/blog-posts/:id", adminDashboardController.getBlogPostById);
router.post("/blog-posts", adminDashboardController.createBlogPost);
router.put("/blog-posts/:id", adminDashboardController.updateBlogPost);
router.delete("/blog-posts/:id", adminDashboardController.deleteBlogPost);
router.post("/blog-posts/:id/restore", adminDashboardController.restoreBlogPost);

export default router;
