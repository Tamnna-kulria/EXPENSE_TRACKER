import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeList from "../../components/Income/IncomeList";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import Modal from "../../components/layouts/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  // Fetch all income
 const fetchIncomeDetails = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.INCOME.GET_ALL_INCOME
    );

    console.log("Income API response:", response.data);

    let incomeArray = [];

    // if API returns array directly
    if (Array.isArray(response.data)) {
      incomeArray = response.data;
    }

    // if API returns single object
    else if (response.data && typeof response.data === "object") {
      incomeArray = [response.data];
    }

    console.log("Final Income Array:", incomeArray);

    setIncomeData(incomeArray);

  } catch (error) {
    console.error("Something went wrong", error);
    setIncomeData([]);
  }
};

  // Add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) return toast.error("Source is required");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount must be > 0");
    if (!date) return toast.error("Date is required");

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });
      toast.success("Income added successfully");
      setOpenAddIncomeModal(false);
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income.");
    }
  };

  // Delete income
  const handleDeleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.INCOME.DELETE_INCOME}/${id}`);
      toast.success("Income deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income.");
    }
  };

  // Download CSV
  const handleDownloadIncomeDetails = () => {
    if (!incomeData.length) {
      alert("No income data to download!");
      return;
    }

    const csvHeader = "Source,Amount,Date\n";
    const csvRows = incomeData.map((income) =>
      `${income.source || "N/A"},${income.amount},${new Date(income.date).toLocaleDateString()}`
    );

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Income_Details.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => handleDeleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
