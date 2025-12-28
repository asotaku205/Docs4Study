import adminBlogPostService from "../service/adminBlogPost.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

class AdminBlogPostController {
  async getAllBlogPosts(req, res) {
    try {
      const result = await adminBlogPostService.getAllBlogPosts(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async getBlogPostById(req, res) {
    try {
      const post = await adminBlogPostService.getBlogPostById(req);
      res.status(200).json(post);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async createBlogPost(req, res) {
    try {
      const post = await adminBlogPostService.createBlogPost(req);
      res.status(201).json(post);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async updateBlogPost(req, res) {
    try {
      const post = await adminBlogPostService.updateBlogPost(req);
      res.status(200).json(post);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async deleteBlogPost(req, res) {
    try {
      const result = await adminBlogPostService.deleteBlogPost(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async restoreBlogPost(req, res) {
    try {
      const result = await adminBlogPostService.restoreBlogPost(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }
}

export default new AdminBlogPostController();
