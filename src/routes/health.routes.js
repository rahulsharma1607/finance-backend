const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Finance backend is working",
    docs: {
      health: "GET /",
      users: "GET /users, GET /users/:id, POST /users, PATCH /users/:id",
      records:
        "GET /records, GET /records/:id, POST /records, PATCH /records/:id, DELETE /records/:id",
      dashboard: "GET /dashboard/summary",
    },
    auth: {
      header: "x-user-id",
      seededUsers: {
        admin: "usr_admin_001",
        analyst: "usr_analyst_001",
        viewer: "usr_viewer_001",
      },
    },
  });
});

module.exports = router;
