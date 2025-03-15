import moment from "moment";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/Auth/Button";
import InputField from "../../components/Auth/InputField";
import { ScheduleModal } from "../../components/Common/Schedule/ScheduleModal";
import { TimeSlotCard } from "../../components/Common/Schedule/TimeSlotCard";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import {
  createNewSlots,
  deleteTimeSlots,
  fetchTimeSlots,
} from "../../service/api";

const Schedule: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [timeSlots, setTimeSlots] = useState<Itime[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTimeSlots();

      if (response?.status === 200 && response?.data?.success) {
        setTimeSlots(response?.data?.timeSlots);
      }
    };
    fetchData();
  }, [searchQuery, refresh]);
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
        try {
          const response = await deleteTimeSlots(id);

          if (response?.status == 200 && response?.data.success) {
            toast.success(response?.data.message);
            setTimeSlots(timeSlots.filter((slot) => slot._id !== id));
            console.log(response?.data.message);
          }
        } catch (error: unknown) {
          errorHandler(error);
        }
      };
    },
    [timeSlots]
  );

  const handleSaveSchedule = useCallback(
    async (scheduleData: { type: string; schedule: TimeSlot[] }) => {
      try {
        console.log(scheduleData,'thsi si final from frontend')
        const response = await createNewSlots(scheduleData);

        if (response?.status == 200 && response?.data?.success) {
          toast.success(response?.data?.message);
          console.log(response?.data?.timeSlots, "thsi si timeslots");
          // setTimeSlots((pre) => [...response.data.timeSlots, ...pre]);

          const formattedSlots = response?.data?.timeSlots.map(
            (slot: Itime) => ({
              ...slot,
              startDate: moment(slot.startDate).toISOString(),
              slots: slot.slots!.map((s: IslotField) => ({
                ...s,
                startTime: moment(s.startTime).toISOString(),
                endTime: moment(s.endTime).toISOString(),
              })),
            })
          );

          setTimeSlots((pre) => [...formattedSlots, ...pre]);
        }
        setRefresh(!refresh);
        console.error(response.data, "failed resonse response");
      } catch (error: unknown) {
        errorHandler(error);
      }
    },
    [refresh]
  );

  return (
    <div className="p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <Button variant="orange" onClick={() => setIsModalOpen(true)}>
          Add Schedule
        </Button>
      </div>

      <hr className="mb-6" />
      <div className="mb-4">
        <div className="relative flex">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/4 text-gray-400"
            size={20}
          />
          <InputField
            type=""
            error=""
            name=""
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSchedule}
      />
    </div>
  );
};

export default Schedule;
