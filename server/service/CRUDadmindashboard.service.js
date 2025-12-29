import BlogPost from "../models/BlogPost.js";
import Course from "../models/Course.js";
import Document from "../models/Document.js";
import Order from "../models/Order.js";
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

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

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

const getAllUsers = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};

  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) {
    const isActive = parseBoolean(req.query.isActive);
    if (isActive === undefined) {
      throw createServiceError("Invalid isActive value", 400, {
        message: "Invalid isActive value",
      });
    }
    filter.isActive = isActive;
  }

  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    data: users,
    pagination: buildPagination(page, limit, total),
  };
};

const getUserById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  const user = await User.findOne(filter);
  if (!user) {
    throw createServiceError("User not found", 404, {
      message: "User not found",
    });
  }
  return user;
};

const createUser = async (req) => {
  const requiredFields = ["email", "password", "fullName"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    throw createServiceError("Missing required fields", 400, {
      message: "Missing required fields",
      missing,
    });
  }

  const newUser = new User(req.body);
  await newUser.save();
  return newUser;
};

const updateUser = async (req) => {
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    throw createServiceError("User not found", 404, {
      message: "User not found",
    });
  }

  Object.keys(req.body || {}).forEach((key) => {
    user[key] = req.body[key];
  });

  await user.save();
  return user;
};

const deleteUser = async (req) => {
  const deletedUser = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedUser) {
    throw createServiceError("User not found", 404, {
      message: "User not found",
    });
  }
  return { message: "User deleted" };
};

const restoreUser = async (req) => {
  const restoredUser = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredUser) {
    throw createServiceError("User not found", 404, {
      message: "User not found",
    });
  }
  return { message: "User restored" };
};

const getAllCourses = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};

  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  if (req.query.isPublished !== undefined) {
    const isPublished =
      req.query.isPublished === "true" || req.query.isPublished === "1";
    filter.isPublished = isPublished;
  }

  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ title: regex }, { slug: regex }, { category: regex }];
  }

  const [courses, total] = await Promise.all([
    Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  return {
    data: courses,
    pagination: buildPagination(page, limit, total),
  };
};

const getCourseById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  const course = await Course.findOne(filter);
  if (!course) {
    throw createServiceError("Course not found", 404, {
      message: "Course not found",
    });
  }
  return course;
};

const createCourse = async (req) => {
  const requiredFields = ["title", "slug", "instructor"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    throw createServiceError("Missing required fields", 400, {
      message: "Missing required fields",
      missing,
    });
  }

  // If instructor is a string (name), try to find admin by name or use first admin
  let instructorId = req.body.instructor;
  if (
    typeof req.body.instructor === "string" &&
    !req.body.instructor.match(/^[0-9a-fA-F]{24}$/)
  ) {
    // Not an ObjectId, try to find admin by fullName or use first admin
    const admin = await User.findOne({
      $or: [
        { fullName: req.body.instructor, role: "admin" },
        { email: req.body.instructor, role: "admin" },
      ],
    }).limit(1);

    if (admin) {
      instructorId = admin._id;
    } else {
      // If no admin found, use first admin or first user
      const firstAdmin = await User.findOne({ role: "admin" }).limit(1);
      if (firstAdmin) {
        instructorId = firstAdmin._id;
      } else {
        const firstUser = await User.findOne().limit(1);
        if (firstUser) {
          instructorId = firstUser._id;
        } else {
          throw createServiceError(
            "No admin found to assign as instructor",
            400,
            {
              message: "No admin found to assign as instructor",
            }
          );
        }
      }
    }
  }

  const courseData = {
    ...req.body,
    instructor: instructorId,
  };

  const course = new Course(courseData);
  await course.save();
  return course;
};

const updateCourse = async (req) => {
  const courseData = { ...req.body };

  // If instructor is a string (name), try to find admin by name or use first admin
  if (
    courseData.instructor &&
    typeof courseData.instructor === "string" &&
    !courseData.instructor.match(/^[0-9a-fA-F]{24}$/)
  ) {
    const admin = await User.findOne({
      $or: [
        { fullName: courseData.instructor, role: "admin" },
        { email: courseData.instructor, role: "admin" },
      ],
    }).limit(1);

    if (admin) {
      courseData.instructor = admin._id;
    } else {
      const firstAdmin = await User.findOne({ role: "admin" }).limit(1);
      if (firstAdmin) {
        courseData.instructor = firstAdmin._id;
      }
    }
  }

  // Convert level to lowercase if provided
  if (courseData.level) {
    courseData.level = courseData.level.toLowerCase();
  }

  const course = await Course.findByIdAndUpdate(req.params.id, courseData, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    throw createServiceError("Course not found", 404, {
      message: "Course not found",
    });
  }
  return course;
};

const deleteCourse = async (req) => {
  const deletedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedCourse) {
    throw createServiceError("Course not found", 404, {
      message: "Course not found",
    });
  }
  return { message: "Course deleted" };
};

const restoreCourse = async (req) => {
  const restoredCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredCourse) {
    throw createServiceError("Course not found", 404, {
      message: "Course not found",
    });
  }
  return { message: "Course restored" };
};

const getAllDocuments = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};

  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  if (req.query.fileType) filter.fileType = req.query.fileType;
  if (req.query.category) filter.category = req.query.category;

  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ title: regex }, { content: regex }];
  }

  const [documents, total] = await Promise.all([
    Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Document.countDocuments(filter),
  ]);

  return {
    data: documents,
    pagination: buildPagination(page, limit, total),
  };
};

const getDocumentById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  const document = await Document.findOne(filter);
  if (!document) {
    throw createServiceError("Document not found", 404, {
      message: "Document not found",
    });
  }
  return document;
};

const createDocument = async (req) => {
  const requiredFields = ["title", "content"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    throw createServiceError("Missing required fields", 400, {
      message: "Missing required fields",
      missing,
    });
  }

  const document = new Document(req.body);
  await document.save();
  return document;
};

const updateDocument = async (req) => {
  const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    throw createServiceError("Document not found", 404, {
      message: "Document not found",
    });
  }
  return document;
};

const deleteDocument = async (req) => {
  const deletedDocument = await Document.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedDocument) {
    throw createServiceError("Document not found", 404, {
      message: "Document not found",
    });
  }
  return { message: "Document deleted" };
};

const restoreDocument = async (req) => {
  const restoredDocument = await Document.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredDocument) {
    throw createServiceError("Document not found", 404, {
      message: "Document not found",
    });
  }
  return { message: "Document restored" };
};

const getAllOrders = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};

  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  if (req.query.status) filter.status = req.query.status;

  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ orderNumber: regex }];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    data: orders,
    pagination: buildPagination(page, limit, total),
  };
};

const getOrderById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) {
    filter.isDeleted = { $ne: true };
  }

  const order = await Order.findOne(filter);
  if (!order) {
    throw createServiceError("Order not found", 404, {
      message: "Order not found",
    });
  }
  return order;
};

const createOrder = async (req) => {
  const requiredFields = ["user", "course", "amount"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    throw createServiceError("Missing required fields", 400, {
      message: "Missing required fields",
      missing,
    });
  }

  const order = new Order(req.body);
  await order.save();
  return order;
};

const updateOrder = async (req) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    throw createServiceError("Order not found", 404, {
      message: "Order not found",
    });
  }
  return order;
};

const deleteOrder = async (req) => {
  const deletedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedOrder) {
    throw createServiceError("Order not found", 404, {
      message: "Order not found",
    });
  }
  return { message: "Order deleted" };
};

const restoreOrder = async (req) => {
  const restoredOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredOrder) {
    throw createServiceError("Order not found", 404, {
      message: "Order not found",
    });
  }
  return { message: "Order restored" };
};

const getAllBlogPosts = async (req) => {
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
};

const getBlogPostById = async (req) => {
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
};

const createBlogPost = async (req) => {
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
};

const updateBlogPost = async (req) => {
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
};

const deleteBlogPost = async (req) => {
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
};

const restoreBlogPost = async (req) => {
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
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  restoreOrder,
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  restoreBlogPost,
};
