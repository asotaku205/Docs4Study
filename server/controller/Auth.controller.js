import { REFRESH_TOKEN_TTL } from "../config/token.js";
import Session from "../models/Session.js";
import AuthService from "../Service/Auth.service.js";
class AuthController {
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                })
            };
            const { accessToken,refreshToken, user } = await AuthService.signin(email, password);
            // trả refresh token về trong cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none", 
                maxAge: REFRESH_TOKEN_TTL,
            });
            return res.status(200).json({
                success: true,
                message: "Signin success",
                data: {
                    user: user,
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error",
            })
        }
    };
    async signup(req, res) {
        try {
            const { email, password, fullName } = req.body;
            if (!email || !password || !fullName) {
                //Thieu cac truong bat buoc
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
            };
            const { user, accessToken, refreshToken } = await AuthService.signup(email, password, fullName);
            // trả refresh token về trong cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none", 
                maxAge: REFRESH_TOKEN_TTL,
            });
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {

                    user: user,
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error",
            })
        };
    };
    async signout(req,res){
        try {
            //lay resfresh token tu cookie
            const token = req.cookie?.refreshToken;
            if(token){
                //xoa resfresh token trong database
                await Session.deleteOne({refreshToken : token});
                //xoa resfresh token tu cookie
                res.clearCookie("refreshToken");
            };
            return res.sendStatus(204);
        } catch (error) {
            
        }
    }
};
export default new AuthController();