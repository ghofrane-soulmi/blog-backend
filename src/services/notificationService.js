const Notification = require("../models/Notification");
const { getIO } = require("../socket");

async function getNotificationsForUser(userId) {
    return Notification.find({ user: userId })
        .populate("articleId", "title")
        .populate("comment", "text")
        .sort({ createdAt: -1 })
        .lean();
}

async function markNotificationAsRead(notificationId) {
    return Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
    );
}

async function createNotification({ userId, message, articleId, commentId }) {
    const notification = new Notification({
        user: userId,
        message,
        articleId,
        comment: commentId,
    });

    const saved = await notification.save();
    const io = getIO();
    io.to(`user-${userId}`).emit("newNotification", saved);

    return saved;
}

module.exports = {
    getNotificationsForUser,
    markNotificationAsRead,
    createNotification,
};
