import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowUpDown,
  BanIcon,
  CircleCheckBigIcon,
  Filter,
  Frown,
  Search,
} from "lucide-react";
import { Table } from "../../components/Admin/Table";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import profile from "../../Asset/rb_2877.png";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { Pagination } from "@mui/material";
import { fetchAllMentee, ToggleMenteeStatus } from "../../service/adminApi";
import InputField from "../../components/Auth/InputField";
import { HttpStatusCode } from "axios";

const MENTEES_PER_PAGE = 8;

export const Mentee_mgt: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [menteeData, setMenteeData] = useState<IMentee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");
  const [totalPage, setTotalPage] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const response = await fetchAllMentee(
          searchQuery,
          sortField,
          sortOrder,
          statusFilter,
          currentPage,
          MENTEES_PER_PAGE
        );

        if (response.status == HttpStatusCode?.Ok && response.data.success) {
          setMenteeData(response.data?.Data);
          setTotalPage(response?.data?.totalPage);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };
    fetchUserData();
  }, [currentPage, searchQuery, sortField, sortOrder, statusFilter]);

  const handleMenteeBlock = (id: string) => {
    notify(id);
  };

  const handleBlock = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (!id) toast.error("credential not found");

      const response = await ToggleMenteeStatus(id);

      console.log(response?.data, response.status, response.data?.message);

      if (response.data?.success && response?.status === HttpStatusCode?.Ok) {
        toast.dismiss();
        setMenteeData((pre) =>
          pre.map((prev) =>
            prev?._id === id ? { ...prev, isBlocked: !prev?.isBlocked } : prev
          )
        );
        setTimeout(() => {
          toast.success(response.data?.message);
        }, 500);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);
  const notify = useCallback(
    (id: string) => {
      toast(
        <ConfirmToast
          message="Change Mentee Status"
          description="Are you sure you want to change Status?"
          onReply={() => handleBlock(id as string)}
          onIgnore={() => toast.dismiss()}
          ariaLabel="mentee status confirmation"
        />,
        {
          closeButton: false,
          className: "p-0  border border-purple-600/40 ml-0",
          autoClose: false,
        }
      );
    },
    [handleBlock]
  );
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );
  return (
    <div className="p-4  mt-16">
      {loading && <Spinner />}

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
            </select>
          </div>
        </div>
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-400" />
        {menteeData.length > 0 ? (
          <Table headers={["Profile", "Name", "Email", "Status", "Actions"]}>
            {menteeData?.map((mentee) => (
              <tr key={mentee?._id}>
                <td className="py-4 flex justify-center">
                  <img
                    src={mentee?.profileUrl ? mentee?.profileUrl : profile}
                    alt={mentee?.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-6 py-4 text-center text-sm">
                  {mentee?.name}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {mentee?.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge
                    status={mentee?.isBlocked ? "blocked" : "active"}
                  />
                </td>
                <td className="px-24 py-4 items-center text-center">
                  <button
                    onClick={() => handleMenteeBlock(mentee?._id as string)}
                    className={`${
                      mentee?.isBlocked
                        ? "text-green-800 hover:text-green-400"
                        : "text-red-800 hover:text-red-400"
                    } font-extrabold`}
                  >
                    {mentee?.isBlocked ? (
                      <CircleCheckBigIcon color="green" />
                    ) : (
                      <BanIcon color="red" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="text-center text-gray-500 mt-4  mb-8 flex justify-center items-center ">
            <Frown className="w-5 mr-4" /> <span>No Data Available</span>
          </div>
        )}

        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-400" />
        <div className="flex justify-center mt-2">
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            shape="circular"
            size="small"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>
    </div>
  );
};
export default Mentee_mgt;
