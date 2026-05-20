import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/layouts/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";


const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  // Fetch all expenses
 const fetchExpenseDetails = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.EXPENSE.GET_ALL_EXPENSE
    );

    console.log("Expense API response:", response.data);

    if (Array.isArray(response.data)) {
      setExpenseData(response.data);
    } else {
      setExpenseData([]);
    }
  } catch (error) {
    console.error("Something went wrong", error);
    setExpenseData([]);
  }
};

  // Add expense
const handleAddExpense = async (expense) => {
  const { category, amount, date, icon } = expense;

  if (!category || !category.trim())
    return toast.error("Category is required");
  if (!amount || isNaN(amount) || Number(amount) <= 0)
    return toast.error("Amount must be > 0");
  if (!date) return toast.error("Date is required");

  try {
    await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
      category,
      amount,
      date,
      icon,
    });
    toast.success("Expense added successfully");
    setOpenAddExpenseModal(false);
    fetchExpenseDetails();
  } catch (error) {
    console.error("Error adding expense:", error);
    toast.error("Failed to add expense.");
  }
};


 
 // Delete expense
const handleDeleteExpense = async (id) => {
  try {
    await axiosInstance.delete(
      API_PATHS.EXPENSE.DELETE_EXPENSE(id)
    );

    toast.success("Expense deleted successfully");

    setOpenDeleteAlert({ show: false, data: null });

    fetchExpenseDetails();
  } catch (error) {
    console.error("Error deleting expense:", error);
    toast.error("Failed to delete expense.");
  }
};
  // Download CSV
    const handleDownloadExpenseDetails = () => {
      if (!expenseData.length) {
        alert("No expense data to download!");
        return;
      }

      const csvHeader = "Category,Amount,Date\n";

      const csvRows = expenseData.map((expense) =>
        `${expense.category || "N/A"},${expense.amount},${new Date(
          expense.date
        ).toLocaleDateString()}`
      );

      const csvContent = csvHeader + csvRows.join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "Expense_Details.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };
    useEffect(() => {
  fetchExpenseDetails();
}, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Expense Overview with chart */}
          <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={() => setOpenAddExpenseModal(true)}
          />

          {/* Expense List */}
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        {/* Add Expense Modal */}
       <Modal
  isOpen={openAddExpenseModal}
  onClose={() => setOpenAddExpenseModal(false)}
  title="Add Expense"
>
  <AddExpenseForm onAddExpense={handleAddExpense} /> {/* ✅ Pass the function here */}
</Modal>


        {/* Delete Expense Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => handleDeleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
