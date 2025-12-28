import adminUserService from "../service/adminUser.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

class AdminUserController {
  async getAllUsers(req, res) {
    try {
      const result = await adminUserService.getAllUsers(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await adminUserService.getUserById(req);
      res.status(200).json(user);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async createUser(req, res) {
    try {
      const user = await adminUserService.createUser(req);
      res.status(201).json(user);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await adminUserService.updateUser(req);
      res.status(200).json(user);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await adminUserService.deleteUser(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async restoreUser(req, res) {
    try {
      const result = await adminUserService.restoreUser(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }
}

export default new AdminUserController();
