import { Trash2 } from "lucide-react";

export const TimeSlotCard = ({
  day,
  startTime,
  endTime,
  price,
  onDelete,
}: TimeSlotCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{day}</h3>
          <p className="text-gray-600">
            {startTime} - {endTime}
          </p>
          <p className="text-orange-500 font-medium mt-2">₹{price}</p>
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
