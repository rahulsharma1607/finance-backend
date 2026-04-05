const { readJsonFile, writeJsonFile } = require("./store");

const RECORDS_FILE = "data/records.json";

const getAllRecords = () => {
  return readJsonFile(RECORDS_FILE);
};

const findRecordById = (id) => {
  return getAllRecords().find((record) => record.id === id);
};

const createRecord = (record) => {
  const records = getAllRecords();
  records.push(record);
  writeJsonFile(RECORDS_FILE, records);
  return record;
};

const updateRecord = (id, updates) => {
  const records = getAllRecords();
  const recordIndex = records.findIndex((record) => record.id === id);

  if (recordIndex === -1) {
    return null;
  }

  records[recordIndex] = {
    ...records[recordIndex],
    ...updates,
  };

  writeJsonFile(RECORDS_FILE, records);
  return records[recordIndex];
};

const deleteRecord = (id) => {
  const records = getAllRecords();
  const existingRecord = records.find((record) => record.id === id);

  if (!existingRecord) {
    return null;
  }

  const nextRecords = records.filter((record) => record.id !== id);
  writeJsonFile(RECORDS_FILE, nextRecords);
  return existingRecord;
};

module.exports = {
  getAllRecords,
  findRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
