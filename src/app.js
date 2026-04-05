const express = require("express");

const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");
const recordRoutes = require("./routes/record.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use("/", healthRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  PORT,
};
