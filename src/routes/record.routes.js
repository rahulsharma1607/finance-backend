const express = require("express");
const router = express.Router();

const {
  getRecords,
  createRecord,
  removeRecord,
  getSummary,
} = require("../controllers/record.controller");

const { checkRole } = require("../middleware/auth.middleware");

// GET → all records
router.get("/", checkRole(["viewer", "analyst", "admin"]), getRecords);

// ADD THIS (IMPORTANT)
router.get("/summary", checkRole(["analyst", "admin"]), getSummary);

// POST → admin only
router.post("/", checkRole(["admin"]), createRecord);

// DELETE → admin only
router.delete("/:id", checkRole(["admin"]), removeRecord);

module.exports = router;