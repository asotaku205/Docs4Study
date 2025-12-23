class AuthController {
    async login (req,res){
        return res.status(200).json({
            message: "Connect success"
        });
    };
    async siginup (req,res){
        
    }
};
export default new AuthController();