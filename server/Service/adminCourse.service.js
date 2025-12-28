 import Course from "../models/Course.js";
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

const getAllCourses = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  if (req.query.isPublished !== undefined) {
    const isPublished = req.query.isPublished === "true" || req.query.isPublished === "1";
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
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  const course = await Course.findOne(filter);
  if (!course) throw createServiceError("Course not found", 404, { message: "Course not found" });
  return course;
};

const createCourse = async (req) => {
  const requiredFields = ["title", "slug", "instructor"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) throw createServiceError("Missing required fields", 400, { message: "Missing required fields", missing });
  const course = new Course(req.body);
  await course.save();
  return course;
};

const updateCourse = async (req) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) throw createServiceError("Course not found", 404, { message: "Course not found" });
  return course;
};

const deleteCourse = async (req) => {
  const deletedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedCourse) throw createServiceError("Course not found", 404, { message: "Course not found" });
  return { message: "Course deleted" };
};

const restoreCourse = async (req) => {
  const restoredCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredCourse) throw createServiceError("Course not found", 404, { message: "Course not found" });
  return { message: "Course restored" };
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
};
