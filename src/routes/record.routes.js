const express = require("express");

const {
  listRecords,
  getRecord,
  createRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
} = require("../controllers/record.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRole([ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN]), listRecords);
router.get("/:id", requireRole([ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN]), getRecord);
router.post("/", requireRole([ROLES.ADMIN]), createRecordHandler);
router.patch("/:id", requireRole([ROLES.ADMIN]), updateRecordHandler);
router.delete("/:id", requireRole([ROLES.ADMIN]), deleteRecordHandler);

module.exports = router;
