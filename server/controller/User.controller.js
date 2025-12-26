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
}
export default new UserController();