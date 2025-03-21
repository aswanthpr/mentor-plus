import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';




interface RevenueChartProps {
  data: RevenueData[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const RevenueChart: React.FC<RevenueChartProps> = React.memo(({
  data,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800]"
        >
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={'month'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#ff8800" name="Revenue" />
            <Bar dataKey="sessions" fill="#ffbb00" name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default RevenueChart;