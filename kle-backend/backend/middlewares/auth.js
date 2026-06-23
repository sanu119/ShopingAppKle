const jwt = require('jsonwebtoken');

// Middleware: reads the token from request headers and verifies it.
// If valid → attaches decoded data to req.user and calls next().
// If invalid → returns 401 Unauthorized.

const protect = (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: 'No token. Please login first.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { email: '...' }
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { protect };
