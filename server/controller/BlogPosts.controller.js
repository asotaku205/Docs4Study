import blogPostsService from "../Service/BlogPosts.service.js";

class BlogPostsController {
  constructor() {
    this.getAllBlogPosts = this.getAllBlogPosts.bind(this);
    this.getBlogPostById = this.getBlogPostById.bind(this);
    this.createBlogPost = this.createBlogPost.bind(this);
    this.updateBlogPost = this.updateBlogPost.bind(this);
    this.deleteBlogPost = this.deleteBlogPost.bind(this);
    this.restoreBlogPost = this.restoreBlogPost.bind(this);
  }

  sendError(res, err, fallbackStatus = 500) {
    const status = err.status || fallbackStatus;
    const payload = err.payload || { error: err.message };
    return res.status(status).json(payload);
  }

  async getAllBlogPosts(req, res) {
    try {
      const result = await blogPostsService.getAllBlogPosts(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async getBlogPostById(req, res) {
    try {
      const post = await blogPostsService.getBlogPostById(req);
      res.status(200).json(post);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async createBlogPost(req, res) {
    try {
      const post = await blogPostsService.createBlogPost(req);
      res.status(201).json(post);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async updateBlogPost(req, res) {
    try {
      const post = await blogPostsService.updateBlogPost(req);
      res.status(200).json(post);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async deleteBlogPost(req, res) {
    try {
      const result = await blogPostsService.deleteBlogPost(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async restoreBlogPost(req, res) {
    try {
      const result = await blogPostsService.restoreBlogPost(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }
}

export default new BlogPostsController();
