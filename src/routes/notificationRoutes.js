const express = require("express");
const { auth } = require("../middlewares/auth");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markAsRead);

module.exports = router;
