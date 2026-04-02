// src/middleware/auth.middleware.js

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // simulate user (for now)
    const userRole = req.headers.role;

    if (!userRole) {
      return res.status(401).json({
        message: "Role header missing",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = {
  checkRole,
};