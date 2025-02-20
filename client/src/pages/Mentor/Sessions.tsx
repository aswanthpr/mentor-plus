import  { useEffect, useState } from "react";
import TabNavigation from "../../components/Common/Bookings/TabNavigation";
import { Search, User } from "lucide-react";
import { axiosInstance } from "../../Config/mentorAxios";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import SessionCard from "../../components/Common/Bookings/SessionCard";
import Spinner from "../../components/Common/common4All/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import { toast } from "react-toastify";

const Sessions = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sessions, setSessions] = useState<ISession[] | []>([]);
  const sessionsPerPage = 5;
  const role = useSelector((state: RootState) => state.menter.mentorRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { status, data } = await axiosInstance.get(`/mentor/sessions`, {
          params: { activeTab },
        });
        if (status == 200 && data?.success) {
          setSessions(data?.slots);
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);


  const filteredSessions = sessions.filter((session) => {
    const isUpcoming =
      session?.status === "PENDING" ||
      session?.status === "CONFIRMED" ||
      session?.status === "CANCEL_REQUESTED"||
      session?.status === "CANCEL_REJECTED"
    const isHistory =
      session?.status === "COMPLETED" || session?.status === "CANCELLED";
    const matchesSearch =
      session?.description
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      session?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase());
    return (activeTab === "upcoming" ? isUpcoming : isHistory) && matchesSearch;
  });

  const handleReclaimRequest = (sessionId: string, value: string) => {
    const val = value==="APPROVE"?"CANCELLED":"CANCEL_REJECTED"
    try {
      const handleRequest = async (sessionId: string, value: string) => {
  
        const { data, status } = await axiosInstance.patch(
          `/mentor/sessions/cancel_request/${sessionId}`,
          {
            val,
          }
        );
      toast.dismiss();
        if (status == 200 && data.success) {
          toast.success(data?.message);
          setSessions(
            sessions.map((session) =>
              session?._id === sessionId
                ? { ...session, status: value }
                : session

              
            )
            .filter((session) => (value !== "CANCEL_REJECTED" ? true : session?._id !== sessionId))
          )
          
        }
      };
      toast(
        <ConfirmToast
          message="change Request Status"
          description="This is final confirmation to change?"
          onReply={() =>
            handleRequest(sessionId as string, value as string)
          }
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
      console.log(error)
      errorHandler(error);
    }
  };
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );
  return (
    <div>
      <div className="bg- p-6 mt-10 ">
        {loading && <Spinner />}
        <h1 className="text-2xl font-bold mb-6">Sessions</h1>

        <TabNavigation
          activeTab={activeTab}
          firstTab="upcoming"
          secondTab="history"
          onTabChange={(tab) => setActiveTab(tab as "upcoming" | "history")}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6 flex">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 " />
            <input
              type="search"
              placeholder="Search by mentor or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent "
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {paginatedSessions.map((session) => (
          <SessionCard
            // handleRating={handleRating}
            key={session?._id}
            session={session}
            role={role}
            handleReclaimRequest={handleReclaimRequest}

          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
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
  );
};

export default Sessions;
