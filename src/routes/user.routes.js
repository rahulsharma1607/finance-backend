const express = require("express");

const {
  listUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
} = require("../controllers/user.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRole([ROLES.ADMIN]), listUsers);
router.get("/:id", requireRole([ROLES.ADMIN]), getUser);
router.post("/", requireRole([ROLES.ADMIN]), createUserHandler);
router.patch("/:id", requireRole([ROLES.ADMIN]), updateUserHandler);

module.exports = router;
