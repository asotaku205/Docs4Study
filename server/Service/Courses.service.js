import Course from "../models/Course.js";
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

class CoursesService {
  async getAllCourses(req) {
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
  }

  async getCourseById(req) {
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
  }

  async createCourse(req) {
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
  }

  async updateCourse(req) {
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
  }

  async deleteCourse(req) {
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
  }

  async restoreCourse(req) {
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
  }
}

export default new CoursesService();
