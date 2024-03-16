const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authorizationHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;
