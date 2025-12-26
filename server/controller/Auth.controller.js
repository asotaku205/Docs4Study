import { REFRESH_TOKEN_TTL } from "../config/token.js";
import Session from "../models/Session.js";
import AuthService from "../Service/Auth.service.js";
import User from "../models/User.js";

const getRefreshCookieOptions = () => ({
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: REFRESH_TOKEN_TTL,
});
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
            res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
            return res.status(200).json({
                success: true,
                message: "Signin success",
                data: {
                    user: user,
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
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
            res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {

                    user: user,
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Server error",
            })
        };
    };
    async signout(req,res){
        try {
            //lay resfresh token tu cookie
            const token = req.cookies?.refreshToken;
            if(token){
                //xoa resfresh token trong database
                await Session.deleteOne({refreshToken : token});
                //xoa resfresh token tu cookie
                res.clearCookie("refreshToken", getRefreshCookieOptions());
            };
            return res.sendStatus(204);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Server error",
            })
        }
    }
    async refreshToken(req,res){
        try {
            //lay refresh token tu cookie
            const token = req.cookies?.refreshToken;
            if(!token){
                return res.status(401).json({
                    success: false,
                    message: "Refresh token not found in cookies"
                });
            };
            //so sang voi db
            const session = await Session.findOne({refreshToken : token});
            if(!session){
                res.clearCookie("refreshToken", getRefreshCookieOptions());
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            };
            //kiem tra refresh token het han
            if(session.expiresAt < new Date()){
                res.clearCookie("refreshToken", getRefreshCookieOptions());
                await Session.deleteOne({ _id: session._id });
                return res.status(403).json({
                    success: false,
                    message: "Refresh token has expired, please signin again"
                });
            }
            const user = await User.findById(session.userId).select("-password");
            if(!user){
                await Session.deleteOne({ _id: session._id });
                res.clearCookie("refreshToken", getRefreshCookieOptions());
                return res.status(404).json({
                    success: false,
                    message: "The user does not exist"
                });
            }
            //tao access token moi
            const accessToken = AuthService.createAccessToken({
                userId : session.userId,

            });
            // xoa refresh token cu va tao refresh token moi
            await Session.deleteOne({ _id: session._id });
            const newRefreshToken = await AuthService.createRefreshTokenSession(session.userId);
            res.cookie("refreshToken", newRefreshToken, getRefreshCookieOptions());
            return res.status(200).json({
                success: true,
                message: "Access token refreshed successfully",
                data: {
                    token : accessToken
                }
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Server error",
            })
        }
    }
};
export default new AuthController();