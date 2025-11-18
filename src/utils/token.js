const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });
    return { token, refreshToken };
};

module.exports = generateTokens;
