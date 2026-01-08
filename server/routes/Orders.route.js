import express from "express";
import ordersController from "../controller/Orders.controller.js";

const router = express.Router();

router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);
router.post("/:id/restore", ordersController.restoreOrder);

export default router;
