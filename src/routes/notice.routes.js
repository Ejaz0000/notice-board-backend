const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { validateNotice } = require("../middlewares/validateNotice");

const {
  createNotice,
  createDraft,
  publishDraft,
  getAllNotices,
  getDraftNotices,
  getSingleNotice,
  updateNoticeStatus,
} = require("../controllers/notice.controller");

router.post(
  "/",
  upload.array("attachments", 5),
  validateNotice,
  createNotice
);

router.post(
  "/drafts",
  upload.array("attachments", 5),
  validateNotice,
  createDraft
);

router.get("/", getAllNotices);
router.get("/drafts", getDraftNotices);
router.get("/:id", getSingleNotice);
router.patch("/:id/status", updateNoticeStatus);
router.patch("/drafts/:id/publish", publishDraft);

module.exports = router;
