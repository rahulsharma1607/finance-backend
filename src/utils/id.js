const createId = (prefix) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${randomPart}`;
};

module.exports = {
  createId,
};
