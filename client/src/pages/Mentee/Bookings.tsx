import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Filter, Search, User } from "lucide-react";
import SessionCard from "../../components/Common/Bookings/SessionCard";
import TabNavigation from "../../components/Common/Bookings/TabNavigation";
import InputField from "../../components/Auth/InputField";
import { RootState } from "../../Redux/store";
import RatingModal from "../../components/Common/Bookings/RatingModal";
import {
  fetchBookingSlots,
  fetchCanceSession,
  fetchSubmitRating,
} from "../../service/menteeApi";
import { joinSessionHandler } from "../../service/commonApi";
import { Pagination } from "@mui/material";
import { HttpStatusCode } from "axios";
import { SESSION_STATUS } from "../../Constants/message";
import Spinner from "../../components/Common/common4All/Spinner";

const Boooking: React.FC = () => {
  const limit = 5;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TsessionTab>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [sessions, setSessions] = useState<ISession[] | []>([]);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const role = useSelector((state: RootState) => state?.mentee.role);
  useEffect(() => {
 
    const fetchData = async () => {
      setLoading((pre) => !pre);
      const response = await fetchBookingSlots(
        activeTab,
        searchQuery,
        sortField,
        sortOrder,
        statusFilter,
        currentPage,
        limit
      );
      setLoading((pre) => !pre);
      if (response?.status == HttpStatusCode?.Ok && response?.data?.success) {
        setSessions(response?.data?.slots);
        setTotalDocuments(response?.data?.totalPage);
      }
    };

    fetchData();
   
  }, [activeTab, currentPage, searchQuery, sortField, sortOrder, statusFilter]);

  const handleCancelSession = useCallback(
    async (sessionId: string, reason: string, customReason: string) => {
      const response = await fetchCanceSession(sessionId, customReason, reason);

      if (response?.status === HttpStatusCode?.Ok && response?.data.success) {
        setSessions(
          sessions.map((session) =>
            session?._id === sessionId
              ? { ...session, status: SESSION_STATUS?.CANCEL_REQUESTED}
              : session
          )
        );
        toast.success(response?.data?.message);
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
     
      if (response?.data.success && response?.status == HttpStatusCode?.Ok) {
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
  const handleSessionJoin = useCallback(
    async (
      sessionId: string,
       sessionCode: string,
        role:string,userId:string) => {

      const response = await joinSessionHandler(sessionId, sessionCode, role);
      if (response?.status == HttpStatusCode?.Ok && response?.data?.success) {
       
        navigate(
          `/${role}/${role == "mentor" ? "session" : "bookings"}/${
            response?.data?.session_Code
          }`,{state:{userId,sessionId}}
        );
      }
    },
    [navigate]
  );

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );
  return (
    <div className="space-y-6 mt-10">
        {loading && <Spinner />}
      <div className=" p-1 round ">
        {/* <h1 className="text-2xl font-bold mb-6">Bookings</h1> */}

        <TabNavigation
          activeTab={activeTab}
          firstTab="upcoming"
          secondTab="history"
          onTabChange={(tab) => setActiveTab(tab as TsessionTab)}
        />
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        {/* {loading && <Spinner />} */}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
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
                {activeTab == "upcoming" ? (
                  <>
                    <option value={SESSION_STATUS?.CANCEL_REQUESTED}>Cancel Request</option>
                  </>
                ) : (
                  <>
                    <option value={SESSION_STATUS?.COMPLETED}>Completed</option>
                    <option value={SESSION_STATUS?.CANCELLED}>Cancelled</option>
                  </>
                )}
              </select>
            </div>

            {/* Sort */}

            <div className="flex items-center gap-2">
              <ArrowUpDown size={20} className="text-gray-400" />
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
          {sessions?.map((session) => {
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
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700 mt-1" />
        <div className="flex justify-center mt-3">
          <Pagination
            count={totalDocuments}
            page={currentPage} // Current page
            onChange={handlePageChange} // Page change handler
            color="standard" // Pagination color
            shape="circular" // Rounded corners
            size="small" // Size of pagination
            siblingCount={1} // Number of sibling pages shown next to the current page
            boundaryCount={1} // Number of boundary pages to show at the start and end
          />
        </div>

        {sessions?.length === 0 && (
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
