const userService = require("../services/userService");

exports.register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userService.loginUserService(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const user = await userService.updateUserRole(req.params.id, req.body.role);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const tokens = await userService.refreshTokenService(req.body.refreshToken);
        res.json({ tokens });
    } catch (err) {
        res.status(err.status || 401).json({ message: err.message });
    }
};
