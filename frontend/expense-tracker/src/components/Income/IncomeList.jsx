import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransationInfoCard'
import moment from 'moment'



const IncomeList = ({ transactions = [], onDelete, onDownload }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-500 mt-4">No income data to display.</p>;
  }

  return (
    <div className="card mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold">Recent Transactions</h5>
        <button
          onClick={onDownload}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          Download
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((item) => (
          <div
            key={item._id || item.date} // use _id from DB or date if no id
            className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
          >
            <div>
              <p className="font-medium">{item.source}</p>
              <p className="text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold text-green-600">
                ${item.amount}
              </p>
              <button
                onClick={() => onDelete(item._id)}
                className="text-red-500 font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
