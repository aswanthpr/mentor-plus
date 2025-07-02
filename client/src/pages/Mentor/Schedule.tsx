import moment from "moment";
import { toast } from "react-toastify";
import { Pagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import Button from "../../components/Auth/Button";
import InputField from "../../components/Auth/InputField";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import { TimeSlotCard } from "../../components/Common/Schedule/TimeSlotCard";
import { ScheduleModal } from "../../components/Common/Schedule/ScheduleModal";
import {
  createNewSlots,
  deleteTimeSlots,
  fetchTimeSlots,
} from "../../service/mentorApi";
import { HttpStatusCode } from "axios";
import Spinner from "../../components/Common/common4All/Spinner";
import useDebounce from "../../Hooks/useDebounce";

const Schedule: React.FC = () => {
  const limit = 15;
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeSlots, setTimeSlots] = useState<Itime[]>([]);
  const [sortField, setSortField] = useState<"startDate">("startDate");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<TscheduleFilter>("all");
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
const debouncedSearchQuery = useDebounce(searchQuery, 500)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading((pre)=>!pre)
      const response = await fetchTimeSlots(
        debouncedSearchQuery,
        statusFilter,
        sortField,
        sortOrder,
        currentPage,
        limit
      );
      setLoading((pre)=>!pre)
      if (response?.status === HttpStatusCode?.Ok && response?.data?.success) {
        setTimeSlots(response?.data?.timeSlots);
        setTotalDocuments(response?.data?.totalPage);
      }
    };
    fetchData();
  }, [debouncedSearchQuery, refresh, statusFilter, sortField, sortOrder, currentPage]);
  const filteredTimeSlots = timeSlots.filter((slot) => {
    const formattedStartDate = slot?.startDate.split("T")[0];
    return formattedStartDate.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = useCallback(
    async (id: string) => {
      toast(
        <ConfirmToast
          message="Delete Time Slot"
          description="Are you sure you want to delete this time slot?"
          onReply={() => confirmDelete(id)}
          onIgnore={() => toast.dismiss()}
          ariaLabel="time slot deletion confirmation"
        />,
        {
          closeButton: false,
          className: "p-0 border border-purple-600/40 ml-1",
          autoClose: false,
        }
      );

      const confirmDelete = async (id: string) => {
        toast.dismiss();

        const response = await deleteTimeSlots(id);

        if (response?.status == HttpStatusCode?.Ok && response?.data.success) {
          toast.success(response?.data.message);
          setTimeSlots(timeSlots.filter((slot) => slot._id !== id));
         
        }
      };
    },
    [timeSlots]
  );

  const handleSaveSchedule = useCallback(
    async (scheduleData: { type: string; schedule: TimeSlot[] }) => {
      
      const response = await createNewSlots(scheduleData);

      if (response?.status == HttpStatusCode?.Ok && response?.data?.success) {
        toast.success(response?.data?.message);
        

        const formattedSlots = response?.data?.timeSlots.map((slot: Itime) => ({
          ...slot,
          startDate: moment(slot.startDate).toISOString(),
          slots: slot.slots!.map((s: IslotField) => ({
            ...s,
            startTime: moment(s.startTime).toISOString(),
            endTime: moment(s.endTime).toISOString(),
          })),
        }));

        setTimeSlots((pre) => [...formattedSlots, ...pre]);
      }
      setRefresh(!refresh);
     
    },
    [refresh]
  );
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );
  return (
    <div className="p-6 mt-10">
      <div className="flex justify-end items-center mb-4">
        <Button variant="orange" onClick={() => setIsModalOpen(true)}>
          Add Schedule
        </Button>
      </div>

      <hr className="mb-3" />
      <div className="bg-white rounded-lg shadow-md p-6 h-[83vh]">
        {loading && <Spinner />}
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
                setStatusFilter(e.target.value as "all" | "today")
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-gray-400" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortField(field as "startDate");
                setSortOrder(order as TSortOrder);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="startDate-asc">Ascending</option>
              <option value="startDate-desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTimeSlots.map((slot) => {
            const startDate = moment(slot?.startDate).format("DD-MM-YYYY");

            const startTime = moment(slot?.startTime).format("hh:mm A");
            const endTime = moment(slot?.endTime).format("hh:mm A");
            return (
              <TimeSlotCard
                key={slot?._id as string}
                day={startDate}
                startTime={startTime}
                endTime={endTime}
                price={slot.price}
                onDelete={() => handleDelete(slot._id as string)}
              />
            );
          })}
        </div>
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex justify-center mt-3">
          <Pagination
            count={totalDocuments as number??0}
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
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSchedule}
      />
    </div>
  );
};

export default Schedule;
