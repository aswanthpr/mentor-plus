import React from "react";
import { format } from "date-fns";

const TransactionList: React.FC<{
  transactions: Itransaction[];
}> = ({ transactions }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Transaction Date
          </th>

          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {transactions?.map((transaction) => {
          const type = transaction?.transactionType;
          const colorClass =
            type === "credit"
              ? "text-green-800"
              : type === "debit"
              ? "text-red-800"
              : type === "paid"
              ? "text-blue-800"
              : "text-yellow-800";

          const badgeBgClass =
            type === "credit"
              ? "bg-green-100"
              : type === "debit"
              ? "bg-red-100"
              : type === "paid"
              ? "bg-blue-100"
              : "bg-yellow-100";
          return (
            <tr key={transaction?._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeBgClass} ${colorClass}`}
                >
                  {transaction?.transactionType?.charAt(0)?.toUpperCase() +
                    transaction?.transactionType?.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(transaction?.createdAt), "MMM d, yyyy HH:mm")}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={`${colorClass}`}>
                  ₹ {Math.abs(transaction?.amount)?.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction?.note}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionList;
