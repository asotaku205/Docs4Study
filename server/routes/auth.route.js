import { Router } from "express";
import AuthController from "../controller/auth.controller.js";

const routerAuth = Router();

routerAuth.get("/login",AuthController.login);

export default routerAuth;