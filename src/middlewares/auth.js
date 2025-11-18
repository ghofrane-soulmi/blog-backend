const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { JWT_SECRET } = process.env;
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        // Any other invalid token error
        return res.status(401).json({ message: 'Invalid token' });
    }
};
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = { auth, authorizeRoles };
