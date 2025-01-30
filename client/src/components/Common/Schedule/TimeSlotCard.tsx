import { Trash2 } from 'lucide-react';
import  moment from 'moment'
interface TimeSlotCardProps {
  day: string;
  startTime: string;
  endTime: string;
  price: string;
  onDelete: () => void;
  key:string
}

export const TimeSlotCard = ({ day, startTime, endTime, price, onDelete,key }: TimeSlotCardProps) => {
    const  endStr = moment(`${endTime}`, ["HH.mm"]).format("hh:mm a")
  const  startStr = moment(`${startTime}`, ["HH.mm"]).format("hh:mm a")
  return (
    <div key={key} className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{day}</h3>
          <p className="text-gray-600">
            {startStr} - {endStr}
          </p>
          <p className="text-orange-500 font-medium mt-2">${price}</p>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};