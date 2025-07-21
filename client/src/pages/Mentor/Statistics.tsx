import  { useEffect, useState } from 'react'
import StatsCard from '../../components/Charts/StatsCard';
import { IndianRupeeIcon, Star, TrendingDown, UserCircle } from 'lucide-react';
import GrowthTrend from '../../components/Charts/GrowthTrend';
import RevenueChart from '../../components/Charts/RevenueChart';
import { fetchMentorStatistics } from '../../service/mentorApi';
import TopMentors from '../../components/Charts/TopMentors';
import { HttpStatusCode } from 'axios';
           
const MentorHome = () => {
  const [data,setData] = useState<ImentorChartData|null>(null)
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    let flag = true;

    const fetchData = async () => {
      const response = await fetchMentorStatistics( timeRange);

      if (flag && response?.data && response?.status == HttpStatusCode?.Ok) {
        setData(response?.data?.result);
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
            title="Today Remaing Sessions "
            value={data?.currentDaySessionsToAttend??0}
            icon={ UserCircle}
            iconBgColor="bg-orange-100"
            iconColor="text-[#ff8800]"
          />
          <StatsCard
            title="current month revenue"
            value={data?.currentMonthRevenue??0}
            icon={IndianRupeeIcon}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Monthly bookings"
            value={data?.currentMonthTotalBookings??0}
            icon={Star}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="current month Cancelled Booking"
            value={data?.currentMonthCancelledBookings??0}
            icon={TrendingDown}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <RevenueChart
            data={data?.period as RevenueData[]}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <GrowthTrend data={data?.cumulativeSession as CumulativeSessionData[]} />
          </div>
          <TopMentors
          mentors={data?.topMentors as ItopMentors[]}
          />
        </div>
      </div>
          )
}

export default MentorHome