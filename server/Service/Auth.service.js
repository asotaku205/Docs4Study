import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import crypto from "crypto";
import Session from "../models/Session.js";
import { REFRESH_TOKEN_TTL } from '../config/token.js';
class AuthService {
  createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
    });
  }

  async createRefreshTokenSession(userId) {
    // Tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Lưu session vào DB
    await Session.create({
      userId,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //Trả refresh token để controller set cookie
    return refreshToken;
  };

  async signin(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    };
    const accessToken = this.createAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role

    })
    const refreshToken = await this.createRefreshTokenSession(user._id);
    return { accessToken, user ,refreshToken};
  }
  async signup(email, password, fullName) {
    //Check user co ton tai ko
    const checkUserSginUp = await User.findOne({ email });
    //Neu ton tai 
    if (checkUserSginUp) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    };

    //Tao user luu vao database
    const user = new User({
      email,
      password,
      fullName
    });
    //Luu user
    await user.save();
    const accessToken = this.createAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.createRefreshTokenSession(user._id);
    return { user, accessToken,refreshToken};
  }
}

export default new AuthService();

