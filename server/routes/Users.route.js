import express from "express";
import usersController from "../controller/Users.controller.js";
import { protectedRoute } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.post("/:id/restore", usersController.restoreUser);
router.get("/profile/me", protectedRoute, usersController.me);

export default router;
