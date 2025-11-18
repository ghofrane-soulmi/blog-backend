const User = require('../models/User');
const generateTokens = require('./token');

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
};

module.exports = loginUser;
