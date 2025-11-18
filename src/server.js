require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const notificationRoutes = require("./routes/notificationRoutes")
const { auth } = require("./middlewares/auth");
const { init: initSocket, emitNewComment } = require("./socket");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4200",
    credentials: true,
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("API Running..."));

app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/protected", auth, (req, res) => {
    res.json({ message: "You have access to this route", user: req.user });
});

const server = http.createServer(app);
const io = initSocket(server);

app.set("emitNewComment", emitNewComment);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
