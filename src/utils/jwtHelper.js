const jwt = require('jsonwebtoken');

// Generate a JWT token
exports.generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
};

// Verify a JWT token
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
