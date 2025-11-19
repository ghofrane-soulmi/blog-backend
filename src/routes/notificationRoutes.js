const express = require("express");
const { auth } = require("../middlewares/auth");
const { getNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", auth, getNotifications);


module.exports = router;
