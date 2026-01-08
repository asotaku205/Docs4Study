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

class UsersService {
  async getAllUsers(req) {
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
  }

  async getUserById(req) {
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
  }

  async createUser(req) {
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
  }

  async updateUser(req) {
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
  }

  async deleteUser(req) {
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
  }

  async restoreUser(req) {
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
  }
}

export default new UsersService();
