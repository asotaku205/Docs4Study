import User from "../models/User.js";
import AuthService from "../Service/Auth.service.js";
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log(email),
                console.log(password);
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                })
            };
            const checkUserLogin = await User.findOne({ email }).select("+password");
            if (!checkUserLogin) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            };
            const checkPassword = await checkUserLogin.comparePassword(password);
            if (!checkPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password or email"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Login success",
                user: {
                    email: checkUserLogin.email,
                }
            })
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
            //Check user co ton tai ko
            const checkUserSginUp = await User.findOne({ email });
            //Neu ton tai 
            if (checkUserSginUp) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists",
                });
            };
            //Tao user luu vao database
            const user = new User({
                email,
                password,
                fullName
            });
            //Luu user
            await user.save();
            const token = AuthService.generateToken({
                user: user._id,
                email: user.email,
                role: user.role,
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    id: user._id,
                    email: user.email,
                    password: user.password,
                    fullName: user.fullName,
                    role: user.role,
                    token: token
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error",
            })
        };
    };
};
export default new AuthController();