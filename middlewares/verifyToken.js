const jwt = require('jsonwebtoken');
const JWT_SECRET = global.process.env.JWT_SECRET;

// verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    const error = new Error('You are not logged in!');
    error.statusCode = 401;
    throw error;
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      const error = new Error('Unauthorized request');
      error.statusCode = 401;
      throw error;
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
      const error = new Error('You are not authorized to perform this action!');
      error.statusCode = 403;
      throw error;
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
      const error = new Error('You are not authorized to perform this action!');
      error.statusCode = 403;
      throw error;
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
      const error = new Error('You are not authorized to perform this action!');
      error.statusCode = 403;
      throw error;
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyHost,
};
