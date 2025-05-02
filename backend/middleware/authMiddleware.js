const jwt = require("jsonwebtoken");
const User = require('../models/User.js');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded._id).select('-password');
    console.log('Found user:', user);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    req.user = user;
    next();
    } catch (error) {
    console.log('JWT Error:', error.message);
    return res.status(401).json({ error: 'Request not authorized' });
    }
};

module.exports = requireAuth;