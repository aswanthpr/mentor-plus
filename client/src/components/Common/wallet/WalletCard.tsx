import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WalletCardProps {
  icon: LucideIcon;
  title: string;
  amount: number;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

const WalletCard: React.FC<WalletCardProps> = ({ icon: Icon, title, amount, actionButton }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm ">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-2 ">
          <Icon className="h-6 w-6 text-[#ff8800]" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
          >
            {actionButton.label}
          </button>
        )}
      </div>
      <p className="text-3xl font-bold">${isNaN(amount)?"0.00":(amount)?.toFixed(2)}</p>
    </div>
  );
};

export default WalletCard;