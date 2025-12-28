import adminOrderService from "../service/adminOrder.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

class AdminOrderController {
  async getAllOrders(req, res) {
    try {
      const result = await adminOrderService.getAllOrders(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await adminOrderService.getOrderById(req);
      res.status(200).json(order);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async createOrder(req, res) {
    try {
      const order = await adminOrderService.createOrder(req);
      res.status(201).json(order);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await adminOrderService.updateOrder(req);
      res.status(200).json(order);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async deleteOrder(req, res) {
    try {
      const result = await adminOrderService.deleteOrder(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async restoreOrder(req, res) {
    try {
      const result = await adminOrderService.restoreOrder(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }
}

export default new AdminOrderController();
