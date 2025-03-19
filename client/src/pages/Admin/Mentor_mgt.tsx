import { useState, useEffect, useCallback } from "react";
import { Table } from "../../components/Admin/Table";
import { useNavigate, useLocation } from "react-router-dom";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import { toast } from "react-toastify";
import profile from "../../Asset/rb_2877.png";
import { ArrowUpDown, BanIcon, CheckCircle2, CircleCheckBigIcon, Eye, Filter, Search } from "lucide-react";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { Pagination } from "@mui/material";
import InputField from "../../components/Auth/InputField";
import {  TSort, TSortOrder } from "../../Types/type";
import { fetchMentorData, fetchMentorVerify, toggleMentorStatus } from "../../service/adminApi";
type Tactive = "verified" | "not-verified"
const PAGE_LIMIT = 8;

export const Mentor_mgt: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTabFromPath = useCallback((path: string) => {
    if (path.includes("not-verified")) return "not-verified";
    return "verified";
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<IMentor[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tactive>(
    getActiveTabFromPath(location.pathname)
  );
const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [totalDoc,setTotalDoc] = useState<number>(0)

  // Pagination change handler
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );

  useEffect(() => {

    const fetchMentors = async () => {
      try {
        const response = await fetchMentorData(
          searchQuery,
          activeTab,
          sortField,
          sortOrder,
          currentPage,
          PAGE_LIMIT
        )
      console.log(response,'resposne')
        if (response?.status && response.data.success) {
          setMentors(response.data?.mentorData);
          setTotalDoc(response?.data?.totalPage)
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, [activeTab, currentPage, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    if (activeTab == "verified") {
      navigate("/admin/mentor_management/verified");
    } else {
      navigate("/admin/mentor_management/not_verified");
    }
  }, [activeTab, navigate]);

  const handleVerify = useCallback(async (id: string) => {
    try {
      toast.dismiss();
      setLoading(true);
      const response = await fetchMentorVerify(id)
     
      if (response && response.data) {
        setTimeout(() => {
          toast.success(response.data.message);
        }, 1000);
        //here change the value opposite dinamically
        setMentors((pre) =>
          pre.map((mentor) =>
            mentor?._id == id ? { ...mentor, verified: true } : mentor
          )
        );
      } else {
        console.error("Invalid response format", response);
      }
    } catch (error: unknown) {
      errorHandler(error);
      toast.dismiss();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);
  const handleStatus = useCallback(async (id: string) => {
    try {
      toast.dismiss();
      setLoading(true);

      const response = await toggleMentorStatus(id)
     
      if (response.status == 200 && response.data.success) {
        setTimeout(() => {
          toast.success(response.data?.message);
        }, 1000);

        setMentors((prev) =>
          prev.map((mentor) =>
            mentor?._id === id
              ? { ...mentor, isBlocked: !mentor?.isBlocked }
              : mentor
          )
        );
      } else {
        console.error("Invalid response format", response);
      }
    } catch (error: unknown) {
      errorHandler(error);
      toast.dismiss();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  const confirmModal = useCallback(
    (id: string) => {
      toast(
        <ConfirmToast
          message="Change Mentor Status"
          description="Are you sure you want to change status?"
          onReply={() => handleStatus(id as string)}
          onIgnore={() => toast.dismiss()}
          ariaLabel="mentor status confirmation"
        />,
        {
          closeButton: false,
          className: "p-0  border border-purple-600/40 ml-0",
          autoClose: false,
        }
      );
    },
    [handleStatus]
  );
  const handleMentorVerify = useCallback(
    (id: string) => {
      toast(
        <ConfirmToast
          message="Verify Mentor"
          description="Are you sure you want to approve?"
          onReply={() => handleVerify(id as string)}
          onIgnore={() => toast.dismiss()}
          ariaLabel="mentor verification confirmation"
        />,
        {
          closeButton: false,
          className: "p-0  border border-purple-600/40 ml-0",
          autoClose: false,
        }
      );
    },
    [handleVerify]
  );
  const handleMentorBlock = useCallback(
    (id: string, tab: string) => {
      if (tab == "verified") {
        confirmModal(id);
      } else {
        handleMentorVerify(id);
      }
    },
    [confirmModal, handleMentorVerify]
  );


  return (
    <div className="p-6  mt-16">
      {loading && <Spinner />}


      {/* <hr className="mb-6" /> */}
      <div className="bg-white rounded-lg shadow-md p-6 h-[87vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              value={activeTab}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setActiveTab(e.target?.value as Tactive)
              }

              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="verified">Verified</option>
              <option value="not-verified">Not Verified</option>
              {/* <option value="blocked">Blocked</option>
              <option value="non-blocked">Non-blocked</option> */}
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
      <Table
        headers={[
          "Profile",
          "Name",
          "Email",
          `${activeTab == "verified" ? "Status" : "Details"}`,
          `${activeTab == "verified" ? "Action" : "Verify"}`,
        ]}
      >
        {mentors.map((mentor) => (
          <tr key={mentor?._id}>
            <td className=" py-4 flex justify-center">
              <img
                src={mentor?.profileUrl ? mentor?.profileUrl : profile}
                alt={mentor?.name}
                className="w-10 h-10 rounded-full  "
              />
            </td>
            <td className="px-6 py-4 text-sm text-center">{mentor?.name}</td>
            <td className="px-6 py-4 text-sm text-center">{mentor?.email}</td>

            {activeTab === "not-verified" ? (
              <td className="px-6 py-4 text-center">
                <button
                  className="px-3 py-1 bg-cyan-200 text-white rounded-full hover:bg-cyan-700 font-bold"
                  onClick={() => (window.location.href = `${mentor?.resume}`)}
                >
                  <Eye className="text-black h-10" />
                </button>
              </td>
            ) : (
              <td className="px-6 py-4 text-center">
                <StatusBadge
                  status={mentor?.isBlocked ? "blocked" : "active"}
                />
              </td>
            )}

            <>
              {activeTab === "not-verified" ? (
                <>
                  <td className="px-6 py-4 text-center font-bold">
                    <button
                      onClick={() => handleMentorVerify(mentor?._id as string)}
                      className="px-3 py-1 bg-green-400 text-white rounded-full hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-10 text-black" />
                    </button>
                  </td>
                </>
              ) : (
                <td className="px-6 py-4 text-center">
                  <button
                    className={` ${
                      mentor.isBlocked
                        ? "text-green-800 hover:text-green-400"
                        : "text-red-800 hover:text-red-400"
                    } `}
                    onClick={() =>
                      handleMentorBlock(mentor?._id as string, activeTab)
                    }
                  >
                    {mentor?.isBlocked ? (
                      <CircleCheckBigIcon color="green" />
                    ) : (
                      <BanIcon color="red" />
                    )}
                  </button>
                </td>
              )}
            </>
          </tr>
        ))}
      </Table>
 <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700 " />
      <div className="flex justify-center items-center mt-2">
        <Pagination
          count={totalDoc} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Page change handler
          color="standard" // Pagination color
          shape="circular" // Rounded corners
          size="small" // Size of pagination
          siblingCount={1} // Number of sibling pages shown next to the current page
          boundaryCount={1} // Number of boundary pages to show at the start and end
        />
      </div>
      </div>
    </div>
  );
};
export default Mentor_mgt;
