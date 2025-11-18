// socket.js
let io = null;

function init(server) {
    const { Server } = require("socket.io");


    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinUser", (userId) => {
            socket.join(`user-${userId}`);
            console.log(`Socket ${socket.id} joined user room: ${userId}`);
        });

        socket.on("joinArticle", (articleId) => {
            socket.join(`article-${articleId}`);
            console.log(`Socket ${socket.id} joined article room: ${articleId}`);
        });

        socket.on("leaveArticle", (articleId) => {
            socket.leave(`article-${articleId}`);
            console.log(`Socket ${socket.id} left article room: ${articleId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
}


function emitNewComment(articleId, comment) {
    if (!io) throw new Error("Socket.io not initialized");
    io.to(`article-${articleId}`).emit("newComment", comment);
}

function emitNotification(userId, notification) {
    if (!io) throw new Error("Socket.io not initialized");
    io.to(`user-${userId}`).emit("newNotification", notification);
}

function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}

module.exports = { init, emitNewComment, emitNotification, getIO };
