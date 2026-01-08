import express from "express";
import blogPostsController from "../controller/BlogPosts.controller.js";

const router = express.Router();

router.get("/", blogPostsController.getAllBlogPosts);
router.get("/:id", blogPostsController.getBlogPostById);
router.post("/", blogPostsController.createBlogPost);
router.put("/:id", blogPostsController.updateBlogPost);
router.delete("/:id", blogPostsController.deleteBlogPost);
router.post("/:id/restore", blogPostsController.restoreBlogPost);

export default router;
