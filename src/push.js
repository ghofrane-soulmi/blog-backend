const webpush = require("web-push");

webpush.setVapidDetails(
    "https://localhost:4200",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

function sendPushNotification(subscription, payload) {
    return webpush.sendNotification(subscription, JSON.stringify(payload));
}

module.exports = { sendPushNotification };
