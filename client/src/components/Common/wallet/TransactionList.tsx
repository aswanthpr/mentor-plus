import React from 'react';
import { format } from 'date-fns';

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'earning';
    date: string;
    customer: string;
    amount: number;
    notes: string;
  }
  
  export interface WalletStats {
    walletBalance: number;
    lifetimeEarnings: number;
    pendingBalance: number;
  }
  
interface TransactionListProps {
  transactions: Itransaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
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
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer
          </th> */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {transactions?.map((transaction) => (
          <tr key={transaction?._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                transaction?.transactionType === 'credit'
                  ? 'bg-green-100 text-green-800'
                  : transaction?.transactionType === 'debit'
                  ? 'bg-red-100 text-red-800'
                  : transaction?.transactionType === 'paid'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {transaction?.transactionType?.charAt(0)?.toUpperCase() + transaction?.transactionType?.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {format(new Date(transaction?.createdAt), 'MMM d, yyyy HH:mm')}
            </td>
            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {transaction.customer}
            </td> */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <span className={transaction?.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${Math.abs(transaction?.amount)?.toFixed(2)}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {transaction?.note}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;