import React from 'react';
import { Search } from 'lucide-react';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target?.value)}
          className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target?.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
      >
        <option value="all">All Types</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
        <option value="earning">Earnings</option>
      </select>
    </div>
  );
};

export default TransactionFilters;