const Expense = require('../models/Expense');
const xlsx = require('xlsx');

//Add Expense Souce
exports.addExpense = async (req, res, next) => { 
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category: category, 
      amount,
      date: new Date(date)
    });

    await newExpense.save();
    res.status(200).json(newExpense);

  } catch (error) { 
    console.error(error); 
    next(error); 
  }
};


//Get all Expense Souce
exports.getAllExpense = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);  
  } catch (error) {
    console.error(error);
    next(error); 
  }
};

//delete Expense Souce
exports.deleteExpense = async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error); 
  }
};

//download Expense Excel 
exports.downloadExpenseExcel = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    const data = expense.map((item)=>({
    category:item.category,
    Amount:item.amount,
    Date:item.date,
    }));
  
    const wb= xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"expense");
    xlsx.writeFile(wb,'expense_details.xlsx');
    res.download('expense_detail.xlsx');

  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the global handler
  }
};
