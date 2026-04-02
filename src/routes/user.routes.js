const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
} = require("../controllers/user.controller");

const { checkRole } = require("../middleware/auth.middleware");

// GET → viewer, analyst, admin
router.get("/", checkRole(["viewer", "analyst", "admin"]), getUsers);

// POST → admin only
router.post("/", checkRole(["admin"]), createUser);

module.exports = router;