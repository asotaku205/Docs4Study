import { Router } from "express";
import UserController from "../controller/User.controller";
const routerUser = Router();
routerUser.get('/me',UserController.me);
export default routerUser;