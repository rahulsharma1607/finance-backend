// src/models/record.model.js

let records = [];

const addRecord = (record) => {
  records.push(record);
  return record;
};

const getAllRecords = () => {
  return records;
};

const deleteRecord = (id) => {
  records = records.filter((r) => r.id !== id);
};

module.exports = {
  addRecord,
  getAllRecords,
  deleteRecord,
};