import { Router } from "express";
import AuthController from "../controller/Auth.controller.js";

const routerAuth = Router();

routerAuth.post("/signin",AuthController.signin);
routerAuth.post("/signup",AuthController.signup);
routerAuth.post("/signout",AuthController.signout);
routerAuth.post("/refresh",AuthController.refreshToken);
//url nhap email de gui link reset password
routerAuth.post("/forgot-password",AuthController.forgotPassword);
//url reset password sau khi nhan duoc link
routerAuth.post("/reset-password",AuthController.resetPassword);
//url kiem tra reset token co hop le hay ko
routerAuth.get("/validate-reset-token",AuthController.validateResetToken);

export default routerAuth;