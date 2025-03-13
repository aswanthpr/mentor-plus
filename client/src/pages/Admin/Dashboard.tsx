import React, { useEffect, useState } from "react";
import StatsCard from "../../components/Charts/StatsCard";
import { DollarSign, Star, TrendingUp, Users } from "lucide-react";
import RevenueChart from "../../components/Charts/RevenueChart";
import CategoryDistribution from "../../components/Charts/CategoryDistribution";
import BookingTrends from "../../components/Charts/BookingTrends";
import GrowthTrend from "../../components/Charts/GrowthTrend";
import TopMentors from "../../components/Charts/TopMentors";
import { fetchDashboardData } from "../../service/api";

// Mock data
const monthlyRevenue = [
  { month: "Jan", revenue: 12000, sessions: 150 },
  { month: "Feb", revenue: 19000, sessions: 230 },
  { month: "Mar", revenue: 15000, sessions: 180 },
  { month: "Apr", revenue: 22000, sessions: 280 },
  { month: "May", revenue: 28000, sessions: 320 },
  { month: "Jun", revenue: 25000, sessions: 290 },
];

const categoryDistribution = [
  { name: "Web Development", value: 35 },
  { name: "Mobile Dev", value: 25 },
  { name: "Data Science", value: 20 },
  { name: "DevOps", value: 15 },
  { name: "UI/UX", value: 5 },
];

const hourlyBookings = [
  { time: "00:00", bookings: 2 },
  { time: "04:00", bookings: 1 },
  { time: "08:00", bookings: 8 },
  { time: "12:00", bookings: 12 },
  { time: "16:00", bookings: 15 },
  { time: "20:00", bookings: 6 },
];

const topMentors = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    expertise: "Full Stack Development",
    earnings: 12500,
    rating: 4.9,
    sessions: 45,
    growth: 12,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    expertise: "Data Science",
    earnings: 10800,
    rating: 4.8,
    sessions: 38,
    growth: -5,
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    expertise: "Mobile Development",
    earnings: 9500,
    rating: 4.7,
    sessions: 32,
    growth: 8,
  },
];

const COLORS = ["#ff8800", "#ff9900", "#ffaa00", "#ffbb00", "#ffcc00"];
const Dashboard: React.FC = () => {
  useEffect(() => {
    let flag = true;
    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal;
    const fetchData = async () => {
      const response = await fetchDashboardData(signal);

      if (flag && response?.data && response?.status) {
        console.log("hia");
      }
    };

    fetchData();
    return () => {
      flag = false;
      controller.abort();
    };
  }, []);
  const [timeRange, setTimeRange] = useState("month");

  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalSessions = monthlyRevenue.reduce(
    (sum, item) => sum + item.sessions,
    0
  );
  const averageRating = 4.8;
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
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconBgColor="bg-orange-100"
            iconColor="text-[#ff8800]"
            change={12}
          />
          <StatsCard
            title="Total Sessions"
            value={totalSessions}
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            change={8}
          />
          <StatsCard
            title="Average Rating"
            value={averageRating}
            icon={Star}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            change={2}
          />
          <StatsCard
            title="Growth Rate"
            value="15%"
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            change={5}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart
            data={monthlyRevenue}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <CategoryDistribution data={categoryDistribution} colors={COLORS} />
          <BookingTrends data={hourlyBookings} />
          <GrowthTrend data={monthlyRevenue} />
        </div>

        {/* Top Mentors */}
        <TopMentors mentors={topMentors} />
      </div>
      {/* </section> */}
    </div>
  );
};

export default Dashboard;
