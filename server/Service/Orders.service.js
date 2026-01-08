import Order from "../models/Order.js";

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

class OrdersService {
  async getAllOrders(req) {
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
  }

  async getOrderById(req) {
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
  }

  async createOrder(req) {
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
  }

  async updateOrder(req) {
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
  }

  async deleteOrder(req) {
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
  }

  async restoreOrder(req) {
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
  }
}

export default new OrdersService();
