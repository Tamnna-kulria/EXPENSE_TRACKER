import React, { useState } from 'react';
import Input from '../Inputs/Input';
import IconPicker from '../layouts/IconPicker';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) =>
    setExpense({ ...expense, [key]: value });

  return (
    <div>
      <IconPicker
        icon={expense.icon}
        onSelect={(icon) => handleChange("icon", icon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)} // ✅ Pass the correct object
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
