import React, { useState } from 'react';
import { WalletIcon, DollarSign, Clock, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { Ttransaction } from '../../Types/type';
import { Pagination } from '@mui/material';


interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning';
  date: string;
  customer: string;
  amount: number;
  notes: string;
}

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  maxAmount: number;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Money to Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSubmit, maxAmount }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && numAmount <= maxAmount) {
      onSubmit(numAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Withdraw Money</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Max: ${maxAmount})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={maxAmount}
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earning',
    date: '2024-03-20T10:00:00Z',
    customer: 'John Doe',
    amount: 75.00,
    notes: 'Mentoring session payment',
  },
  {
    id: '2',
    type: 'withdrawal',
    date: '2024-03-19T15:30:00Z',
    customer: 'System',
    amount: -150.00,
    notes: 'Withdrawal to bank account',
  },
  {
    id: '3',
    type: 'deposit',
    date: '2024-03-18T09:15:00Z',
    customer: 'Self',
    amount: 200.00,
    notes: 'Wallet top-up',
  },
];

const WalletPage: React.FC = () => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'earning'>('all');

  const walletBalance = 500.00;
  const lifetimeEarnings = 1200.00;
  const pendingBalance = 300.00;
  const itemsPerPage = 5;

  const handleAddMoney = (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      date: new Date().toISOString(),
      customer: 'Self',
      amount: amount,
      notes: 'Wallet top-up',
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleWithdraw = (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      date: new Date().toISOString(),
      customer: 'System',
      amount: -amount,
      notes: 'Withdrawal to bank account',
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-6 w-6 text-[#ff8800]" />
              <h2 className="text-lg font-semibold">Wallet Balance</h2>
            </div>
            <button
              onClick={() => setShowAddMoney(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              Add Money
            </button>
          </div>
          <p className="text-3xl font-bold">${walletBalance.toFixed(2)}</p>
        </div>

        {/* Lifetime Earnings Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-6 w-6 text-[#ff8800]" />
            <h2 className="text-lg font-semibold">Lifetime Earnings</h2>
          </div>
          <p className="text-3xl font-bold">${lifetimeEarnings.toFixed(2)}</p>
        </div>

        {/* Pending Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-[#ff8800]" />
              <h2 className="text-lg font-semibold">Pending Balance</h2>
            </div>
            <button
              onClick={() => setShowWithdraw(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              Withdraw
            </button>
          </div>
          <p className="text-3xl font-bold">${pendingBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value as React.SetStateAction<string>)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as Ttransaction)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="earning">Earnings</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
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
                  Customer
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
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'deposit'
                        ? 'bg-green-100 text-green-800'
                        : transaction.type === 'withdrawal'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(transaction.date), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
        <Pagination
        count={totalPages}  // Set total number of pages
        page={currentPage}  // Set current page
        // onChange={() => setCurrentPage(currentPage)}  // Handle page change
        color="standard"  // You can change the color
        shape="circular"  // Shape of the pagination (rounded corners)
        size="medium"  // Size of pagination
        siblingCount={2}  // Number of sibling pages to show
        boundaryCount={1}  // Number of boundary pages to show
      />
          // <div className="mt-6 flex justify-center">
          //   <div className="flex gap-2">
          //     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          //       <button
          //         key={page}
          //         onClick={() => setCurrentPage(page)}
          //         className={`w-10 h-10 rounded-lg font-medium ${
          //           currentPage === page
          //             ? 'bg-[#ff8800] text-white'
          //             : 'text-gray-600 hover:bg-gray-100'
          //         }`}
          //       >
          //         {page}
          //       </button>
          //     ))}
          //   </div>
          // </div>
        )}
      </div>

      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSubmit={handleAddMoney}
      />

      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onSubmit={handleWithdraw}
        maxAmount={pendingBalance}
      />
    </div>
  );
};

export default WalletPage;