const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
