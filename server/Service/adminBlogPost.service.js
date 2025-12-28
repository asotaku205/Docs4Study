import BlogPost from "../models/BlogPost.js";
const MAX_LIMIT = 100;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: total === 0 ? 0 : Math.ceil(total / limit),
});
const shouldIncludeDeleted = (req) => req.query.includeDeleted === "true" || req.query.includeDeleted === "1";
const createServiceError = (message, status, payload) => {
  const error = new Error(message);
  error.status = status;
  if (payload) error.payload = payload;
  return error;
};

const getAllBlogPosts = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ title: regex }, { content: regex }];
  }
  const [posts, total] = await Promise.all([
    BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    BlogPost.countDocuments(filter),
  ]);
  return {
    data: posts,
    pagination: buildPagination(page, limit, total),
  };
};

const getBlogPostById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  const post = await BlogPost.findOne(filter);
  if (!post) throw createServiceError("Blog post not found", 404, { message: "Blog post not found" });
  return post;
};

const createBlogPost = async (req) => {
  const requiredFields = ["title", "author"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) throw createServiceError("Missing required fields", 400, { message: "Missing required fields", missing });
  const post = new BlogPost(req.body);
  await post.save();
  return post;
};

const updateBlogPost = async (req) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) throw createServiceError("Blog post not found", 404, { message: "Blog post not found" });
  return post;
};

const deleteBlogPost = async (req) => {
  const deletedPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedPost) throw createServiceError("Blog post not found", 404, { message: "Blog post not found" });
  return { message: "Blog post deleted" };
};

const restoreBlogPost = async (req) => {
  const restoredPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredPost) throw createServiceError("Blog post not found", 404, { message: "Blog post not found" });
  return { message: "Blog post restored" };
};

export default {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  restoreBlogPost,
};
