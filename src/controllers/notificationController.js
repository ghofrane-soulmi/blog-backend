const notificationService = require("../services/notificationService");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.user.id);
        res.json(notifications);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await notificationService.markNotificationAsRead(req.params.id);
        res.json(notification);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const saved = await notificationService.createNotification(req.body);
        res.status(201).json(saved);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
