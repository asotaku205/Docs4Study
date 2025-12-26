import { Router } from "express";
import UserController from "../controller/User.controller.js";
import { protectedRoute } from "../middleware/Auth.middleware.js";
const routerUser = Router();

routerUser.get('/me', protectedRoute, UserController.me);

export default routerUser;