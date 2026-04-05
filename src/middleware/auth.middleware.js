const { findUserById } = require("../models/user.model");

const requireAuth = (req, res, next) => {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
      details: "Send x-user-id with an active seeded or created user id.",
    });
  }

  const user = findUserById(userId);

  if (!user) {
    return res.status(401).json({
      message: "Invalid user",
      details: "No user exists for the provided x-user-id.",
    });
  }

  if (user.status !== "active") {
    return res.status(403).json({
      message: "Inactive users cannot access the API",
    });
  }

  req.user = user;
  next();
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: "Role check requires authentication middleware first",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
