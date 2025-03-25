import React from "react";
import { monthNames } from "../../Constants/const Values";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


// Component
const GrowthTrend: React.FC<GrowthTrendProps> = React.memo(({ data }) => {
  // Transform cumulative data
  const transformedData: GrowthData[] = data?.map((item) => ({
    month: monthNames[item?.month - 1],
    revenue: item?.revenue,
    cumulative: item?.cumulativeRevenue,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Cumulative Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#ff8800"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#ffbb00"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default GrowthTrend;
