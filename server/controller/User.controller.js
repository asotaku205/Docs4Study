class UserController {
    me(req,res){
        return res.status(200).json({
            message: "User connect success"
        })
    }
}
export default new UserController();