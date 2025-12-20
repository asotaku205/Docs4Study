const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: String,
    views: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx", "ppt", "pptx", "txt", "other"],
      default: "pdf",
    },
    thumbnail: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
