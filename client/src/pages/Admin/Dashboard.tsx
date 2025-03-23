import React, { useEffect, useState } from "react";
import StatsCard from "../../components/Charts/StatsCard";
import { DollarSign, Star, TrendingDown, Users } from "lucide-react";
import RevenueChart from "../../components/Charts/RevenueChart";
import CategoryDistribution from "../../components/Charts/CategoryDistribution";
import TopMentors from "../../components/Charts/TopMentors";
import { fetchDashboardData } from "../../service/adminApi";


const COLORS = ["#ff8800", "#ff9900", "#ffaa00", "#ffbb00", "#ffcc00"];

const Dashboard: React.FC = () => {
  const role = location.pathname.split("/")[1];
  console.log(role)
  const [timeRange, setTimeRange] = useState("month");
  const [cardData, setCardData] = useState<IcardData>({
    totalRevenue: 0,
    totalBookings: 0,
    totalCancelledBookings: 0,
    uniqueMentorsThisMonth: 0,
    yearly: [{ year: 0, revenue: 0, sessions: 0 }],
    monthly: [{ month: 0, revenue: 0, sessions: 0 }],
    weekly: [{ week: 0, revenue: 0, sessions: 0 }],
    categoryDistribution: [
      { category: "", value: 0 },
      { category: "", value: 0 },
    ],
    topMentors: [
      {
        mentorId: "",
        mentorName: "",
        totalSessions: 0,
        totalRevenue: 0,
        category: "",
        averageRating: 0,
        profileUrl: "",
      },
    ],
  });
  useEffect(() => {
    let flag = true;
    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal;
    const fetchData = async () => {
      const response = await fetchDashboardData(signal, timeRange);

      if (flag && response?.data && response?.status) {
        setCardData(response?.data?.salesData);
      }
    };
if(role=="admin"){
  fetchData();

}
    return () => {
      flag = false;
      controller.abort();
    };
  }, [role, timeRange]);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
const formated_Data =()=>{

   const  formatedData =
    timeRange === "week"
      ? cardData?.weekly?.map(({ week, revenue, sessions }) => ({
          month: `Week ${week}`, 
          revenue,
          sessions,
        })) ?? []
      : timeRange === "month"
      ? cardData?.monthly?.map(({ month, revenue, sessions }) => ({
          month: monthNames[Number(month) - 1],
          revenue,
          sessions,
        })) ?? []
      : cardData?.yearly?.map(({ year, revenue, sessions }) => ({
          year: `${year}`, 
          revenue,
          sessions,
        })) ?? [];
        return formatedData
}

  return (
    <div>
      <div className="mb-2 mt-12  ">
        <div className="flex items-center gap-3 justify-center">
          <h1 className=" text-md font-bold text-gray-900  mt-5">
            Welcome, Admin
          </h1>
        </div>
      </div>

      <div className="h-0.5 bg-gray-200 w-full " />

      {/* <section className='flex items-center justify-between mb-6'> */}
      <div className="space-y-6 m-4 ">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={cardData?.totalRevenue ??0}
            icon={DollarSign}
            iconBgColor="bg-orange-100"
            iconColor="text-[#ff8800]"
          />
          <StatsCard
            title="Total Bookings"
            value={cardData?.totalBookings}
            icon={Star}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Active mentors"
            value={cardData?.uniqueMentorsThisMonth}
            icon={Users}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="Cancelled Booking"
            value={cardData?.totalCancelledBookings}
            icon={TrendingDown}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart
            data={formated_Data()}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <CategoryDistribution
            data={cardData?.categoryDistribution}
            colors={COLORS}
          />
          {/* <BookingTrends data={hourlyBookings} />
          <GrowthTrend data={monthlyRevenue} /> */}
        </div>

        {/* Top Mentors */}
        <TopMentors mentors={cardData?.topMentors} />
      </div>
    </div>
  );
};

export default Dashboard;
