import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ Status: false, Error: "Unauthorized. Token not provided." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(403).json({ Status: false, Error: "Unauthorized. Invalid token." });
        }
        req.user = user; // Set the decoded user information to the request object
        next(); // Call next middleware or route handler
    });
}


