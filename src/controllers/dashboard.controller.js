const { buildDashboardSummary } = require("../services/dashboard.service");

const getDashboardSummary = (req, res) => {
  res.json({
    data: buildDashboardSummary(),
  });
};

module.exports = {
  getDashboardSummary,
};
