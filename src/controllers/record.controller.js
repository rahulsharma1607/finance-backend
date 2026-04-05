const { createId } = require("../utils/id");
const { validateRecordPayload } = require("../utils/validation");
const {
  getAllRecords,
  findRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../models/record.model");

const applyRecordFilters = (records, query) => {
  const {
    type,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
  } = query;

  return records.filter((record) => {
    if (type && record.type !== type) {
      return false;
    }

    if (category && record.category.toLowerCase() !== String(category).toLowerCase()) {
      return false;
    }

    if (startDate && record.date < startDate) {
      return false;
    }

    if (endDate && record.date > endDate) {
      return false;
    }

    if (minAmount && record.amount < Number(minAmount)) {
      return false;
    }

    if (maxAmount && record.amount > Number(maxAmount)) {
      return false;
    }

    if (search) {
      const searchText = String(search).toLowerCase();
      const haystack = `${record.category} ${record.note}`.toLowerCase();
      if (!haystack.includes(searchText)) {
        return false;
      }
    }

    return true;
  });
};

const listRecords = (req, res) => {
  const allRecords = getAllRecords();
  const filteredRecords = applyRecordFilters(allRecords, req.query);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const startIndex = (page - 1) * limit;
  const pagedRecords = filteredRecords
    .sort((first, second) => new Date(second.date) - new Date(first.date))
    .slice(startIndex, startIndex + limit);

  res.json({
    data: pagedRecords,
    meta: {
      total: filteredRecords.length,
      page,
      limit,
    },
  });
};

const getRecord = (req, res) => {
  const record = findRecordById(req.params.id);

  if (!record) {
    return res.status(404).json({
      message: "Record not found",
    });
  }

  res.json({
    data: record,
  });
};

const createRecordHandler = (req, res) => {
  const { errors, data } = validateRecordPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid record payload",
      errors,
    });
  }

  const now = new Date().toISOString();
  const record = createRecord({
    id: createId("rec"),
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
    note: data.note || "",
    createdBy: req.user.id,
    createdAt: now,
    updatedAt: now,
  });

  res.status(201).json({
    message: "Record created successfully",
    data: record,
  });
};

const updateRecordHandler = (req, res) => {
  const existingRecord = findRecordById(req.params.id);

  if (!existingRecord) {
    return res.status(404).json({
      message: "Record not found",
    });
  }

  const { errors, data } = validateRecordPayload(req.body, { allowPartial: true });

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid record payload",
      errors,
    });
  }

  const updatedRecord = updateRecord(req.params.id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });

  res.json({
    message: "Record updated successfully",
    data: updatedRecord,
  });
};

const deleteRecordHandler = (req, res) => {
  const deletedRecord = deleteRecord(req.params.id);

  if (!deletedRecord) {
    return res.status(404).json({
      message: "Record not found",
    });
  }

  res.json({
    message: "Record deleted successfully",
    data: deletedRecord,
  });
};

module.exports = {
  listRecords,
  getRecord,
  createRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
};
