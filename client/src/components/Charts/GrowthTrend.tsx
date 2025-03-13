import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface GrowthData {
  month: string;
  revenue: number;
  sessions: number;
}

interface GrowthTrendProps {
  data: GrowthData[];
}

const GrowthTrend: React.FC<GrowthTrendProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Growth Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#ff8800" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="sessions" stroke="#ffbb00" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthTrend;