const Income = require("../models/Income");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Dashboard API called for userId:", userId);

    // Total Income
    const totalIncomeResult = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = totalIncomeResult[0]?.total || 0;

    // Total Expense
    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = totalExpenseResult[0]?.total || 0;

    // Last 60 days Income
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });
    const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Last 30 days Expense
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });
    const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Last 5 Transactions overall
    const lastIncomeTxns = await Income.find({ userId }).sort({ date: -1 }).limit(5);
    const lastExpenseTxns = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
    const lastTransactions = [
      ...lastIncomeTxns.map(txn => ({ ...txn.toObject(), type: "income" })),
      ...lastExpenseTxns.map(txn => ({ ...txn.toObject(), type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Final response
    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpenses: { total: expensesLast30Days, transactions: last30DaysExpenseTransactions },
      last60DaysIncome: { total: incomeLast60Days, transactions: last60DaysIncomeTransactions },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
