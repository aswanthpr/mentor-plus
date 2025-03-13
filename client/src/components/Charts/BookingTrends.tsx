import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface BookingData {
  time: string;
  bookings: number;
}

interface BookingTrendsProps {
  data: BookingData[];
}

const BookingTrends: React.FC<BookingTrendsProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Hourly Booking Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="bookings" stroke="#ff8800" fill="#fff3e6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingTrends;