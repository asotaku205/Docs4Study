import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        //lay token tu header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token could not be found"
            });
        }
        //xac thuc access token  
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Access token has expired or is incorrect"
                });
            }
            //tim user trong database 
            const user = await User.findById(decodedUser.userId).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "The user does not exist"
                });
            }
            //tra ve user de co the dung lai
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    };
}