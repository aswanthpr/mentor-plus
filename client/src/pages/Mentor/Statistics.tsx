import  { useEffect, useState } from 'react'
import StatsCard from '../../components/Charts/StatsCard';
import { DollarSign, Star, TrendingDown, UserCircle } from 'lucide-react';
import GrowthTrend from '../../components/Charts/GrowthTrend';
import RevenueChart from '../../components/Charts/RevenueChart';
import { fetchMentorStatistics } from '../../service/api';

const ChartOverview = () => {
  const [data,setData] = useState({})
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      const response = await fetchMentorStatistics( timeRange);
      console.log('hi')
      if (flag && response?.data && response?.status) {
        setData(response?.data?.salesData);
      }
    };

    fetchData();
    return () => {
      flag = false;
    };
  }, [timeRange]);

  return (
    <div>

      <div className="space-y-6 mt-16  ">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={0}
            icon={DollarSign}
            iconBgColor="bg-orange-100"
            iconColor="text-[#ff8800]"
          />
          <StatsCard
            title="Total Bookings"
            value={0}
            icon={Star}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Active mentors"
            value={0}
            icon={UserCircle}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="Cancelled Booking"
            value={0}
            icon={TrendingDown}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        <RevenueChart
            data={[]}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <GrowthTrend data={[]} />
        </div>
      </div>
          )
}

export default ChartOverview