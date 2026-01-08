import ordersService from "../Service/Orders.service.js";

class OrdersController {
  sendError(res, err, fallbackStatus = 500) {
    const status = err.status || fallbackStatus;
    const payload = err.payload || { error: err.message };
    return res.status(status).json(payload);
  }

  async getAllOrders(req, res) {
    try {
      const result = await ordersService.getAllOrders(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await ordersService.getOrderById(req);
      res.status(200).json(order);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async createOrder(req, res) {
    try {
      const order = await ordersService.createOrder(req);
      res.status(201).json(order);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await ordersService.updateOrder(req);
      res.status(200).json(order);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async deleteOrder(req, res) {
    try {
      const result = await ordersService.deleteOrder(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async restoreOrder(req, res) {
    try {
      const result = await ordersService.restoreOrder(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }
}

export default new OrdersController();
