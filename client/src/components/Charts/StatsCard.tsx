import React from 'react';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  change: number;
  changeLabel?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  change,
  changeLabel = 'vs last month'
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 ${iconBgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {change >= 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={change >= 0 ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 ml-2">{changeLabel}</span>
      </div>
    </div>
  );
};

export default StatsCard;