import { Router } from "express";
import AuthController from "../controller/Auth.controller.js";

const routerAuth = Router();

routerAuth.post("/signin",AuthController.signin);
routerAuth.post("/signup",AuthController.signup);
routerAuth.post("/signout",AuthController.signout);

export default routerAuth;