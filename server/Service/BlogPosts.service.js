import BlogPost from "../models/BlogPost.js";
import User from "../models/User.js";

const MAX_LIMIT = 100;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: total === 0 ? 0 : Math.ceil(total / limit),
});

const shouldIncludeDeleted = (req) =>
  req.query.includeDeleted === "true" || req.query.includeDeleted === "1";

const createServiceError = (message, status, payload) => {
  const error = new Error(message);
  error.status = status;
  if (payload) {
    error.payload = payload;
  }
  return error;
};

class BlogPostsService {
  async getAllBlogPosts(req) {
    const { page, limit, skip } = parsePagination(req);
    const filter = {};

    if (!shouldIncludeDeleted(req)) {
      filter.isDeleted = { $ne: true };
    }

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
  }

  async getBlogPostById(req) {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  const post = await BlogPost.findOne(filter);
  if (!post) {
    throw createServiceError("Blog post not found", 404, {
      message: "Blog post not found",
    });
    }
    return post;
  }

  async createBlogPost(req) {
  const requiredFields = ["title", "author"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    throw createServiceError("Missing required fields", 400, {
      message: "Missing required fields",
      missing,
    });
  }

  // If author is a string (name), try to find user by name or email
  let authorId = req.body.author;
  if (
    typeof req.body.author === "string" &&
    !req.body.author.match(/^[0-9a-fA-F]{24}$/)
  ) {
    // Not an ObjectId, try to find user by fullName or email
    const user = await User.findOne({
      $or: [{ fullName: req.body.author }, { email: req.body.author }],
    }).limit(1);

    if (user) {
      authorId = user._id;
    } else {
      // If no user found, create a new user or use first user
      const firstUser = await User.findOne().limit(1);
      if (firstUser) {
        authorId = firstUser._id;
      } else {
        throw createServiceError("No user found to assign as author", 400, {
          message: "No user found to assign as author",
        });
      }
    }
  }

  const postData = {
    ...req.body,
    author: authorId,
  };

    const post = new BlogPost(postData);
    await post.save();
    return post;
  }

  async updateBlogPost(req) {
  const postData = { ...req.body };

  // If author is a string (name), try to find user by name or email
  if (
    postData.author &&
    typeof postData.author === "string" &&
    !postData.author.match(/^[0-9a-fA-F]{24}$/)
  ) {
    const user = await User.findOne({
      $or: [{ fullName: postData.author }, { email: postData.author }],
    }).limit(1);

    if (user) {
      postData.author = user._id;
    } else {
      const firstUser = await User.findOne().limit(1);
      if (firstUser) {
        postData.author = firstUser._id;
      }
    }
  }

  // Convert status to lowercase if provided
  if (postData.status) {
    postData.status = postData.status.toLowerCase();
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, postData, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw createServiceError("Blog post not found", 404, {
      message: "Blog post not found",
    });
    }
    return post;
  }

  async deleteBlogPost(req) {
  const deletedPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedPost) {
    throw createServiceError("Blog post not found", 404, {
      message: "Blog post not found",
    });
    }
    return { message: "Blog post deleted" };
  }

  async restoreBlogPost(req) {
  const restoredPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredPost) {
    throw createServiceError("Blog post not found", 404, {
      message: "Blog post not found",
    });
    }
    return { message: "Blog post restored" };
  }
}

export default new BlogPostsService();
