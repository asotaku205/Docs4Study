import express from "express";
import adminBlogPostController from "../controller/adminBlogPost.controller.js";

const router = express.Router();

router.get("/blog-posts", (req, res) => adminBlogPostController.getAllBlogPosts(req, res));
router.get("/blog-posts/:id", (req, res) => adminBlogPostController.getBlogPostById(req, res));
router.post("/blog-posts", (req, res) => adminBlogPostController.createBlogPost(req, res));
router.put("/blog-posts/:id", (req, res) => adminBlogPostController.updateBlogPost(req, res));
router.delete("/blog-posts/:id", (req, res) => adminBlogPostController.deleteBlogPost(req, res));
router.post("/blog-posts/:id/restore", (req, res) => adminBlogPostController.restoreBlogPost(req, res));

export default router;
