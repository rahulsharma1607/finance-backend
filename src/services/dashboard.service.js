const { getAllRecords } = require("../models/record.model");

const sortByDateDescending = (records) => {
  return [...records].sort((first, second) => {
    return new Date(second.date) - new Date(first.date);
  });
};

const buildDashboardSummary = () => {
  const records = getAllRecords();
  const totals = {
    income: 0,
    expense: 0,
  };
  const categoryTotals = {};
  const monthlyTrendsMap = {};

  records.forEach((record) => {
    totals[record.type] += record.amount;

    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = {
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    categoryTotals[record.category][record.type] += record.amount;
    categoryTotals[record.category].net =
      categoryTotals[record.category].income - categoryTotals[record.category].expense;

    const monthKey = record.date.slice(0, 7);
    if (!monthlyTrendsMap[monthKey]) {
      monthlyTrendsMap[monthKey] = {
        month: monthKey,
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    monthlyTrendsMap[monthKey][record.type] += record.amount;
    monthlyTrendsMap[monthKey].net =
      monthlyTrendsMap[monthKey].income - monthlyTrendsMap[monthKey].expense;
  });

  return {
    totalIncome: totals.income,
    totalExpenses: totals.expense,
    netBalance: totals.income - totals.expense,
    recordCount: records.length,
    categoryTotals: Object.entries(categoryTotals).map(([category, values]) => ({
      category,
      ...values,
    })),
    recentActivity: sortByDateDescending(records).slice(0, 5),
    monthlyTrends: Object.values(monthlyTrendsMap).sort((first, second) => {
      return first.month.localeCompare(second.month);
    }),
  };
};

module.exports = {
  buildDashboardSummary,
};
