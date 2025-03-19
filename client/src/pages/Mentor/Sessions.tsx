import { useCallback, useEffect, useState } from "react";
import TabNavigation from "../../components/Common/Bookings/TabNavigation";
import { ArrowUpDown, Filter, Search, User } from "lucide-react";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import SessionCard from "../../components/Common/Bookings/SessionCard";
import Spinner from "../../components/Common/common4All/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import InputField from "../../components/Auth/InputField";
import { TFilter, TSort, TSortOrder } from "../../Types/type";
import { createSessionCodeApi, fetchCanceSessionResponse, getMentorSessions, markAsSessionCompleted } from "../../service/mentorApi";
import { joinSessionHandler } from "../../service/commonApi";
import { Pagination } from "@mui/material";

const Sessions: React.FC = () => {
  const limit = 5;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState<ISession[] | []>([]);
   const [totalDocuments,setTotalDocuments]=useState<number>(0);
  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");
  const role = useSelector((state: RootState) => state.menter.mentorRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await getMentorSessions(
          activeTab,
          searchQuery,
          sortField,
          sortOrder,
          statusFilter,
          currentPage,
          limit,
        );
         
        if (response?.status == 200 && response?.data?.success) {
          setSessions(response?.data?.slots);
          setTotalDocuments(response?.data?.totalPage)
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, currentPage, searchQuery, sortField, sortOrder, statusFilter]);

  const handleReclaimRequest = useCallback(
    (sessionId: string, val: string) => {
      const value = val === "APPROVE" ? "CANCELLED" : "REJECTED";
      try {
        const handleRequest = async (sessionId: string, value: string) => {
          const response = await fetchCanceSessionResponse(sessionId, value);
          toast.dismiss();
          if (response?.status == 200 && response?.data?.success) {
            toast.success(response?.data?.message);
            setSessions(
              sessions
                .map((session) =>
                  session?._id === sessionId
                    ? { ...session, status: value }
                    : session
                )
                .filter((session) =>
                  value !== "REJECTED" ? true : session?._id !== sessionId
                )
            );
          }
        };
        toast(
          <ConfirmToast
            message="change Request Status"
            description="This is final confirmation to change?"
            onReply={() => handleRequest(sessionId as string, value as string)}
            onIgnore={() => toast.dismiss()}
            ariaLabel=" status confirmation"
          />,
          {
            closeButton: false,
            className: "p-0  border border-purple-600/40 ml-0",
            autoClose: false,
          }
        );

        console.log(sessionId, value);
      } catch (error: unknown) {
        console.log(error);
        errorHandler(error);
      }
    },
    [sessions]
  );

  // const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  // const paginatedSessions = filteredSessions.slice(
  //   (currentPage - 1) * sessionsPerPage,
  //   currentPage * sessionsPerPage
  // );

  const crerateSessionCode = useCallback(async (_id: string) => {
    const resp = await createSessionCodeApi(_id);

    if (resp?.status == 200 && resp.data) {
      setSessions((pre) =>
        pre?.map((session) =>
          session?._id === _id
            ? { ...session, sessionCode: resp?.data?.sessionCode }
            : session
        )
      );
      toast.success("successfully created SessionCode ✔️");
    }
  }, []);

  const handleCompletedSession = useCallback(async (bookingId: string) => {
    toast(
      <ConfirmToast
        message="make as session completed"
        description="This is final confirmation to change?"
        onReply={() => {
          handleRequest(bookingId);
          toast.dismiss();
        }}
        onIgnore={() => toast.dismiss()}
        ariaLabel=" status confirmation"
      />,
      {
        closeButton: false,
        className: "p-0  border border-purple-600/40 ml-0",
        autoClose: false,
      }
    );

    const handleRequest =  async (bookingId: string) => {
      const response = await markAsSessionCompleted(bookingId);
      if (response?.status == 200 && response?.data.success) {
        toast.success(response?.data?.message);
        setSessions((pre) =>
          pre.map((sess) =>
            sess._id === bookingId ? { ...sess, status: "COMPLETED" } : sess
          )
        );
      }
    };
  }, []);

  const handleSessionJoin = useCallback(
    async (sessionId: string, session_Code: string, role: string) => {
      console.log(sessionId, session_Code, role);
      const response = await joinSessionHandler(sessionId, session_Code, role);
      if (response?.status == 200 && response?.data?.success) {
        console.log(response?.session_Code, "sessionCode");
        navigate(
          `/${role}/${role == "mentor" ? "session" : "bookings"}/${
            response?.data?.session_Code
          }`
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
    <div>
      <div className=" mt-12 ">
        {loading && <Spinner />}
        <h1 className="text-2xl font-bold mb-4">Sessions</h1>

        <TabNavigation
          activeTab={activeTab}
          firstTab="upcoming"
          secondTab="history"
          onTabChange={(tab) => setActiveTab(tab as "upcoming" | "history")}
        />
      </div>
      <div className="bg-white mt-2 p-4 rounded-lg shadow-sm">
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
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
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
                <option value="COMPLETED">completed</option>
                <option value="CANCELLED">cancelled</option>
                <option value="REJECTED">rejected</option>
                <option value="CONFIRMED">confirmed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {sessions?.map((session) => (
            <SessionCard
              handleSessionJoin={handleSessionJoin}
              handleCreateSessionCode={crerateSessionCode}
              key={session?._id}
              session={session}
              role={role}
              handleCompletedSession={handleCompletedSession}
              handleReclaimRequest={handleReclaimRequest}
            />
          ))}
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
    </div>
  );
};

export default Sessions;
