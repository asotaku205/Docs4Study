import express from "express";
import adminUserController from "../controller/adminUser.controller.js";

const router = express.Router();

router.get("/users", (req, res) => adminUserController.getAllUsers(req, res));
router.get("/users/:id", (req, res) => adminUserController.getUserById(req, res));
router.post("/users", (req, res) => adminUserController.createUser(req, res));
router.put("/users/:id", (req, res) => adminUserController.updateUser(req, res));
router.delete("/users/:id", (req, res) => adminUserController.deleteUser(req, res));
router.post("/users/:id/restore", (req, res) => adminUserController.restoreUser(req, res));

export default router;
