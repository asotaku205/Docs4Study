import express from "express";
import adminOrderController from "../controller/adminOrder.controller.js";

const router = express.Router();

router.get("/orders", (req, res) => adminOrderController.getAllOrders(req, res));
router.get("/orders/:id", (req, res) => adminOrderController.getOrderById(req, res));
router.post("/orders", (req, res) => adminOrderController.createOrder(req, res));
router.put("/orders/:id", (req, res) => adminOrderController.updateOrder(req, res));
router.delete("/orders/:id", (req, res) => adminOrderController.deleteOrder(req, res));
router.post("/orders/:id/restore", (req, res) => adminOrderController.restoreOrder(req, res));

export default router;
