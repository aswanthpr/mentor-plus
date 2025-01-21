import React from 'react';

interface QuestionFilterProps {
  activeFilter: 'answered' | 'unanswered';
  onFilterChange: (filter: 'answered' | 'unanswered') => void; 
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-4 border-b border-gray-200 mb-3">
      <button
        onClick={() => onFilterChange('answered')}
        className={`pb-4 px-4 text-sm font-semibold relative transition-colors  ${
          activeFilter === 'answered'
            ? 'text-[#ff8800] border-b-2 border-[#ff8800]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Answered
      </button>
      <button
        onClick={() => onFilterChange('unanswered')}
        className={`pb-4 px-4 text-sm font-medium relativetransition-colors ${
          activeFilter === 'unanswered'
            ? 'text-[#ff8800] border-b-2 border-[#ff8800]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Unanswered
      </button>
    </div>
  );
};

export default QuestionFilter;

