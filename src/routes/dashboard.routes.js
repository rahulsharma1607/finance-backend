const express = require("express");

const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(requireAuth);

router.get("/summary", requireRole([ROLES.ANALYST, ROLES.ADMIN]), getDashboardSummary);

module.exports = router;
