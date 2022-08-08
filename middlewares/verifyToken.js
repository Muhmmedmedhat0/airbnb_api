const jwt = require('jsonwebtoken');
const JWT_SECRET = global.process.env.JWT_SECRET;

// verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Token is not valid' });
    }
    req.user = decodedToken;
    next();
  });
};

// verify user
const verifyUser = (req, res, next) => {
  // user should be authenticated first
  verifyToken(req, res, () => {
    // then check if the user is the same as the one in the token or it is admin
    if (req.user.userId === req.params.id || req.user.isAdmin === 'admin') {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not authorized to perform this action!',
      });
    }
  });
};

// verify host user
const verifyHost = (req, res, next) => {
  // user should be authenticated first
  verifyToken(req, res, () => {
    // then check if the user is host
    if (req.user.isAdmin === 'host' || req.user.isAdmin === 'admin') {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not authorized to perform this action!',
        error: 'You are not authorized to perform this action!',
      });
    }
  });
};
// verify admin user
const verifyAdmin = (req, res, next) => {
  // user should be authenticated first
  verifyToken(req, res, () => {
    // then check if the user is admin
    if (req.user.isAdmin === 'admin') {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not authorized to perform this action!',
        error: 'You are not authorized to perform this action!',
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyHost,
};
