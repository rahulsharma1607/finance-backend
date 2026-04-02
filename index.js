const express = require("express");

const app = express(); // MUST come before app.use
const PORT = 5000;

app.use(express.json());

// import routes
const healthRoutes = require("./src/routes/health.routes");
const userRoutes = require("./src/routes/user.routes");
const recordRoutes = require("./src/routes/record.routes");

// use routes
app.use("/", healthRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});