
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const loginUser = require("../utils/loginHelper");

async function registerUser({ name, email, password, role }) {
    const user = new User({ name, email, password, role });
    await user.save();

    const { tokens } = await loginUser(email, password);
    return { user, tokens };
}

async function loginUserService({ email, password }) {
    const { user, tokens } = await loginUser(email, password);
    return { user, tokens };
}

async function getAllUsers() {
    return User.find().select("-password");
}

async function updateUserRole(userId, role) {
    return User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
}

async function refreshTokenService(refreshToken) {
    if (!refreshToken) throw { status: 400, message: "Refresh token required" };

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw { status: 404, message: "User not found" };
    if (user.refreshToken !== refreshToken) throw { status: 403, message: "Invalid refresh token" };

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
}

module.exports = {
    registerUser,
    loginUserService,
    getAllUsers,
    updateUserRole,
    refreshTokenService,
};
