import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/Auth/Button';
import InputField from '../../components/Auth/InputField';
import { ScheduleModal } from '../../components/Common/Schedule/ScheduleModal';
import { TimeSlotCard } from '../../components/Common/Schedule/TimeSlotCard';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  price: string;
}

const Schedule: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from your backend
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      price: '50'
    },
    {
      id: '2',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '15:00',
      price: '45'
    },
    // Add more mock data as needed
  ]);


  const filteredTimeSlots = timeSlots.filter(slot =>
    slot.day.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
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

            key={slot.id}
            day={slot.day}
            startTime={slot.startTime}
            endTime={slot.endTime}
            price={slot.price}
            onDelete={() => handleDelete(slot.id)}
          />
        ))}
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  )
}

export default Schedule