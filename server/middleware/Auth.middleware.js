import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        // Ưu tiên lấy token từ HttpOnly cookie (bảo mật hơn)
        let token = req.cookies?.accessToken;
        console.log("Token from cookie:", token ? token.substring(0, 20) + "..." : "No cookie token");
        
        // Fallback: lấy token từ header (để hỗ trợ old clients)
        if (!token) {
            const authHeader = req.headers["authorization"];
            console.log("Auth header:", authHeader);
            token = authHeader && authHeader.split(" ")[1];
            console.log("Token from header:", token ? token.substring(0, 20) + "..." : "No header token");
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token could not be found"
            });
        }
        //xac thuc access token  
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.log("JWT verify error:", err.message);
                return res.status(403).json({
                    success: false,
                    message: "Access token has expired or is incorrect"
                });
            }
            //tim user trong database 
            const user = await User.findById(decodedUser.userId).select("-password");
            if (!user) {
                console.log("User not found for ID:", decodedUser.userId);
                return res.status(404).json({
                    success: false,
                    message: "The user does not exist"
                });
            }
            console.log("User authenticated:", user.email);
            //tra ve user de co the dung lai
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Protected route error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    };
}