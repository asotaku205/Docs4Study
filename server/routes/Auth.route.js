import { Router } from "express";
import AuthController from "../controller/Auth.controller.js";

const routerAuth = Router();

routerAuth.post("/login",AuthController.login);
routerAuth.post("/sginup",AuthController.signup);

export default routerAuth;