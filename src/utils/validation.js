const { ROLE_VALUES } = require("../constants/roles");

const USER_STATUSES = ["active", "inactive"];
const RECORD_TYPES = ["income", "expense"];

const isValidDateString = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.length >= 10;
};

const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

const validateUserPayload = (payload, options = {}) => {
  const errors = [];
  const allowPartial = Boolean(options.allowPartial);
  const data = {};

  if (!allowPartial || payload.name !== undefined) {
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      errors.push("name must be a non-empty string");
    } else {
      data.name = payload.name.trim();
    }
  }

  if (!allowPartial || payload.email !== undefined) {
    const email = normalizeEmail(payload.email);
    if (!email || !email.includes("@")) {
      errors.push("email must be a valid email address");
    } else {
      data.email = email;
    }
  }

  if (!allowPartial || payload.role !== undefined) {
    if (!ROLE_VALUES.includes(payload.role)) {
      errors.push(`role must be one of: ${ROLE_VALUES.join(", ")}`);
    } else {
      data.role = payload.role;
    }
  }

  if (payload.status !== undefined) {
    if (!USER_STATUSES.includes(payload.status)) {
      errors.push(`status must be one of: ${USER_STATUSES.join(", ")}`);
    } else {
      data.status = payload.status;
    }
  }

  return { errors, data };
};

const validateRecordPayload = (payload, options = {}) => {
  const errors = [];
  const allowPartial = Boolean(options.allowPartial);
  const data = {};

  if (!allowPartial || payload.amount !== undefined) {
    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push("amount must be a number greater than 0");
    } else {
      data.amount = amount;
    }
  }

  if (!allowPartial || payload.type !== undefined) {
    if (!RECORD_TYPES.includes(payload.type)) {
      errors.push(`type must be one of: ${RECORD_TYPES.join(", ")}`);
    } else {
      data.type = payload.type;
    }
  }

  if (!allowPartial || payload.category !== undefined) {
    if (typeof payload.category !== "string" || !payload.category.trim()) {
      errors.push("category must be a non-empty string");
    } else {
      data.category = payload.category.trim();
    }
  }

  if (!allowPartial || payload.date !== undefined) {
    if (!isValidDateString(payload.date)) {
      errors.push("date must be a valid date string such as 2026-04-05");
    } else {
      data.date = payload.date.slice(0, 10);
    }
  }

  if (payload.note !== undefined) {
    if (typeof payload.note !== "string") {
      errors.push("note must be a string");
    } else {
      data.note = payload.note.trim();
    }
  }

  return { errors, data };
};

module.exports = {
  USER_STATUSES,
  RECORD_TYPES,
  normalizeEmail,
  validateUserPayload,
  validateRecordPayload,
};
