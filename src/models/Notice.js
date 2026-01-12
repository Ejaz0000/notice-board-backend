const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    targetDepartments: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],

    noticeTitle: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      default: null,
    },

    employeeName: {
      type: String,
      default: null,
    },

    position: {
      type: String,
      default: null,
    },

    noticeType: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },

    publishDate: {
      type: Date,
      required: true,
    },

    noticeBody: {
      type: String,
      required: true,
    },

    attachments: [
      {
        fileName: String,
        filePath: String,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
