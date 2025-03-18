import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Filter, Search, User } from "lucide-react";
import SessionCard from "../../components/Common/Bookings/SessionCard";
import TabNavigation from "../../components/Common/Bookings/TabNavigation";
import InputField from "../../components/Auth/InputField";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import Spinner from "../../components/Common/common4All/Spinner";
import { RootState } from "../../Redux/store";
import { TFilter, TSort, TSortOrder } from "../../Types/type";
import RatingModal from "../../components/Common/Bookings/RatingModal";
import { fetchBookingSlots, fetchCanceSession, fetchSubmitRating } from "../../service/menteeApi";
import { joinSessionHandler } from "../../service/commonApi";

const Boooking: React.FC = () => {
  // const limit = 6;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [sessions, setSessions] = useState<ISession[] | []>([]);
  const sessionsPerPage = 5;

  const role = useSelector((state: RootState) => state?.mentee.role);

  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetchBookingSlots(activeTab);

        if (response?.status == 200 && response?.data?.success) {
          setSessions(response?.data?.slots);
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleCancelSession = useCallback(
    async (sessionId: string, reason: string, customReason: string) => {
      try {
        const response = await fetchCanceSession(
          sessionId,
          customReason,
          reason
        );

        if (response?.status === 200 && response?.data.success) {
          setSessions(
            sessions.map((session) =>
              session?._id === sessionId
                ? { ...session, status: "CANCEL_REQUESTED" }
                : session
            )
          );
          toast.success(response?.data?.message);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    },
    [sessions]
  );

  const handleRating = useCallback((session: ISession) => {
    setSelectedSession(session);
    setShowRatingModal(true);
  }, []);

  const handleSubmitRating = useCallback(
    async (rating: number, review: string) => {
      const response = await fetchSubmitRating(
        review,
        selectedSession!,
        rating
      );
      console.log(response?.data);
      if (response?.data.success && response?.status == 200) {
        toast.success(response?.data?.message);

        setSessions((prev) =>
          prev.map((session) =>
            session._id === selectedSession?._id
              ? {
                  ...session,
                  review: {
                    ...session.review,
                    rating: response?.data?.feedback?.rating,
                    feedback: response?.data?.feedback?.feedback,
                  } as Ireview,
                }
              : session
          )
        );
        if (response?.data?.oldReview) {
          console.log(response?.data?.oldReview, "older one");
          setSessions((prev) =>
            prev.map((session) =>
              session.review?._id === response?.data?.oldReview
                ? {
                    ...session,
                    review: null,
                  }
                : session
            )
          );
        }
      }
    },
    [selectedSession]
  );

  const filteredSessions = sessions.filter((session) => {
    const isUpcoming =
      session?.status === "PENDING" ||
      session?.status === "CONFIRMED" ||
      session?.status === "REJECTED" ||
      session?.status === "CANCEL_REQUESTED";
    const isHistory =
      session?.status === "COMPLETED" || session?.status === "CANCELLED";
    const matchesSearch =
      session?.description
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      session?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase());
    return (activeTab === "upcoming" ? isUpcoming : isHistory) && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );
  const handleSessionJoin = useCallback(
    async (sessionId: string, sessionCode: string, role: string) => {
      console.log(sessionCode, sessionId, role);
      const response = await joinSessionHandler(sessionId, sessionCode, role);
      if (response?.status == 200 && response?.data?.success) {
        navigate(
          `/${role}/${role == "mentor" ? "session" : "bookings"}/${
            response?.data?.session_Code
          }`
        );
      }
    },
    [navigate]
  );
  return (
    <div className="space-y-6 mt-10">
      <div className=" p-1 round ">
        {/* <h1 className="text-2xl font-bold mb-6">Bookings</h1> */}

        <TabNavigation
          activeTab={activeTab}
          firstTab="upcoming"
          secondTab="history"
          onTabChange={(tab) => setActiveTab(tab as "upcoming" | "history")}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {loading && <Spinner />}
        <div className="mb-6 flex">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <InputField
                type={"search"}
                placeholder="Search questions or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as TFilter)
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
              >
                 <option value="all">All Status</option>
                {
                  activeTab=="upcoming"?(
                    <>
                    <option value="REJECTED">Rejected</option>
                    <option value="CONFIRMED">Confirmed</option>
                    </>
                  ):(
                    <>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    
                    </>
                  )
                }
              </select>
            </div>

            {/* Sort */}

            <div className="flex items-center gap-2">
              <ArrowUpDown size={20} className="text-gray-400" />
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortField(field as TSort);
                  setSortOrder(order as TSortOrder);
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
              >
                 <option value="createdAt-desc">Newest First</option>
                 <option value="createdAt-asc">Oldest First</option>
              
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedSessions.map((session) => {
            return (
              <SessionCard
                handleSessionJoin={handleSessionJoin}
                handleCancelSession={handleCancelSession}
                handleRating={handleRating}
                key={session?._id}
                session={session}
                role={role}
              />
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === page
                        ? "bg-[#ff8800] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {paginatedSessions.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No sessions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "upcoming"
                ? "You don't have any upcoming sessions"
                : "You don't have any past sessions"}
            </p>
          </div>
        )}
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        session={selectedSession as ISession}
      />
    </div>
  );
};

export default Boooking;
