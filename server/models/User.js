import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: String,
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    comments: [
      {
        blogPost: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BlogPost",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password trước khi save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Virtual field: Tổng số bài đăng
userSchema.virtual("totalPosts", {
  ref: "BlogPost",
  localField: "_id",
  foreignField: "author",
  count: true,
});

// Để virtual fields được serialize khi convert to JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
