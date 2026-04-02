const {
  addRecord,
  getAllRecords,
  deleteRecord,
} = require("../models/record.model");

// GET all records
const getRecords = (req, res) => {
  let records = getAllRecords();

  const { type, category } = req.query;

  if (type) {
    records = records.filter((r) => r.type === type);
  }

  if (category) {
    records = records.filter((r) => r.category === category);
  }

  res.json({
    message: "Filtered records",
    data: records,
  });
};

// CREATE record
const createRecord = (req, res) => {
  const { amount, type, category, date, note } = req.body;

  if (!amount || !type || !category) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }

  const newRecord = {
    id: Date.now(),
    amount,
    type,
    category,
    date: date || new Date(),
    note: note || "",
  };

  addRecord(newRecord);

  res.status(201).json({
    message: "Record created",
    data: newRecord,
  });
};

// DELETE record
const removeRecord = (req, res) => {
  const { id } = req.params;

  deleteRecord(Number(id));

  res.json({
    message: "Record deleted",
  });
};

// SUMMARY
const getSummary = (req, res) => {
  const records = getAllRecords();

  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach((r) => {
    if (r.type === "income") totalIncome += r.amount;
    if (r.type === "expense") totalExpense += r.amount;
  });

  res.json({
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  });
};

module.exports = {
  getRecords,
  createRecord,
  removeRecord,
  getSummary,
};