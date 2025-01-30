import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/Auth/Button';
import InputField from '../../components/Auth/InputField';
import { ScheduleModal } from '../../components/Common/Schedule/ScheduleModal';
import { TimeSlotCard } from '../../components/Common/Schedule/TimeSlotCard';
import { errorHandler } from '../../Utils/Reusable/Reusable';
import { axiosInstance } from '../../Config/mentorAxios';
import { toast } from 'react-toastify';
import ConfirmToast from '../../components/Common/common4All/ConfirmToast';

// interface TimeSlot {
//   id: string;
//   day: string;
//   startTime: string;
//   endTime: string;
//   price: string;
// }

const Schedule: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from your backend
  const [timeSlots, setTimeSlots] = useState<Itime[]>([]);


useEffect(()=>{
  const fetchData = async ()=>{
  const {data,status} = await axiosInstance.get(`/mentor/schedule/get-time-slots`);

    if(status ===200 && data?.success){
      // console.log(data)
    setTimeSlots(data?.timeSlots)
    }
  }
  fetchData()
},[searchQuery]);
const filteredTimeSlots = timeSlots.filter(slot =>{
  console.log(slot.startDate.split('T')[0]  ,slot.startDate.toLowerCase())
  return slot.startDate.toLowerCase().includes(searchQuery.toLowerCase())
  
}
);


  const handleDelete = async (id: string) => {
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
     
    const confirmDelete = async( id:string)=>{
    toast.dismiss() 
    try {
     
      const {status,data} = await axiosInstance.delete(`/mentor/schedule/remove-time-slot`,{data:{slotId:id}});

      if(status==200 && data.success){
        toast.success(
          data.message
        )
        setTimeSlots(timeSlots.filter(slot => slot._id !== id));
        console.log(data.message)
      }
    } catch (error:unknown) {
      errorHandler(error);
    }
  }
    
  };

  const handleSaveSchedule =  async  (scheduleData: { type: string; schedule: TimeSlot[] }) => {

    try {
      const response = await axiosInstance.post(`/mentor/schedule/create-slots`,scheduleData);
      if(response.status ==200 && response.data.success){
        toast.success(response.data?.message);
        setTimeSlots((pre)=>[...pre,...response.data.timeSlots])

        console.log(response.data,'this is the data  in the response');
      }
      console.error(response.data,'failed resonse response');
    } catch (error:unknown) {
      errorHandler(error);
    }
  };

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/4 text-gray-400" size={20} />
          <InputField
            type=''
            error=''
            name=''
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTimeSlots.map((slot) => (
          
          <TimeSlotCard

            key={slot?._id as string}
            day={slot.startDate.split('T')[0]}
            startTime={slot.startStr}
            endTime={slot.endStr}
            price={slot.price}
            onDelete={() => handleDelete(slot._id as string)}
          />
        ))}
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSchedule}
      />

    </div>
  )
}

export default Schedule