import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import crypto from "crypto";
import Session from "../models/Session.js";
import { REFRESH_TOKEN_TTL } from '../config/token.js';
import nodemailer from 'nodemailer';

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
    return { accessToken, user, refreshToken };
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
    return { user, accessToken, refreshToken };
  };
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("The user does not exist");
      error.statusCode = 404;
      throw error;
    }
    //tao token de reset password
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10 phut
    await user.save();
    //tra ve reset token de gui email
    return resetToken;
  };
  async sendEmailService(emailUser, resetLink) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `Docs4Study Support <${process.env.EMAIL_USERNAME}>`,
      to: emailUser,
      subject: 'Reset Your Password - Docs4Study',
      html: `
     <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="margin:0; padding:20px; background-color:#f3f4f6; font-family:Arial,sans-serif;">
  <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background:#2563eb; padding:25px; color:#ffffff; text-align:center;">
      <h2 style="margin:0; font-size:22px;">Docs4Study</h2>
    </div>

    <div style="padding:30px; color:#374151; line-height:1.6;">
      <h3 style="margin-top:0; color:#111827;">Reset Your Password</h3>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      
      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" style="background:#2563eb; color:#ffffff; padding:12px 30px; text-decoration:none; border-radius:25px; font-weight:bold; display:inline-block;">
          🔐 Reset Password
        </a>
      </div>

      <div style="background:#f9fafb; border-left:4px solid #2563eb; padding:15px; font-size:13px; border-radius:4px;">
        <strong>Note:</strong> This link expires in 10 minutes. If you didn't request this, please ignore this email.
      </div>
      
      <p style="font-size:12px; color:#6b7280; margin-top:25px; word-break:break-all;">
        Trouble clicking? Copy this link: <br>
        <a href="${resetLink}" style="color:#2563eb;">Link here</a>
      </p>
    </div>

    <div style="padding:20px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
      © ${new Date().getFullYear()} Docs4Study • <a href="mailto:support@docs4study.com" style="color:#2563eb; text-decoration:none;">Support</a>
    </div>
  </div>
</body>
</html>`
    });
  };
  async validateResetToken(resetToken) {
    //hash lai reset token de so sanh voi token trong db
    const validateTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    //tim user trong db voi reset token da dc hash
    const user = await User.findOne({
      resetPasswordToken: validateTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
      //thoi gian hien tai phai nho hon thoi gian het han 10 phut
    });
    //neu ko tim thay user nao thi token ko hop le
    if (!user) {
      const error = new Error("Invalid or expired password reset token");
      error.statusCode = 400;
      throw error;
    }
    return user;
  };
  async resetPassword(resetToken, newPassword) {
    //dua vao reset token de tim user
    const user = await this.validateResetToken(resetToken);
    //cap nhat lai password moi
    user.password = newPassword;
    //xoa reset token va thoi gian het han
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    if (!user) {
      const error = new Error("Error resetting password");
      error.statusCode = 500;
      throw error;
    }
  };
}

export default new AuthService();

