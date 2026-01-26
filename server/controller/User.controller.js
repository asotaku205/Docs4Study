import User from "../models/User.js";

class UserController {
    me(req,res){
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                data: {
                    user: user
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error",
            })
        }
    }
    
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user._id;
            
            // Kiểm tra các trường bắt buộc
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Old password and new password are required"
                });
            }
            
            // Kiểm tra password mới phải ít nhất 6 ký tự
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters"
                });
            }
            
            // Lấy user với password
            const user = await User.findById(userId).select("+password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            
            // Kiểm tra old password có đúng không
            const isPasswordValid = await user.comparePassword(oldPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
            
            // Cập nhật password mới
            user.password = newPassword;
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }
}
export default new UserController();