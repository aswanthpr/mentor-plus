import { Plus, Trash2 } from 'lucide-react';
import TimePickers from './TimePickers';
import dayjs from 'dayjs';


interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface RecurringScheduleFormProps {
  startDate: string;
  endDate: string;
  price: string;
  selectedDays: string[];
  timeSlots: TimeSlot[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPriceChange: (price: string) => void;
  onDayToggle: (day: string) => void;
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onTimeSlotChange: (index: number, key: keyof TimeSlot, value: string) => void;
  // onSubmit: (data: any) => void; 
}

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const RecurringScheduleForm = ({
  startDate,
  endDate,
  price,
  selectedDays,
  timeSlots,
  onStartDateChange,
  onEndDateChange,
  onPriceChange,
  onDayToggle,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onTimeSlotChange,

}: RecurringScheduleFormProps) => {

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
          />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
          />
        </div>
      </div>

      <div className='pr-6'>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price for All Sessions
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Enter price"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Days
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => onDayToggle(day)}
              className={`px-3 py-1 rounded-full ${
                selectedDays.includes(day)
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Start Time
              </label>
              <TimePickers
                  value={slot.startTime ? dayjs(slot.startTime, 'HH:mm') : null}
                  onChange={(newValue) => {
                    const timeString = newValue?.format('HH:mm') || '';
                    onTimeSlotChange(index, "startTime", timeString);
                  }}
                  // slotProps={{ extField: { size: 'small' } }}
                />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                End Time
              </label>
              <TimePickers
                  value={slot.endTime ? dayjs(slot.endTime, 'HH:mm') : null}
                  onChange={(newValue) => {
                    const timeString = newValue?.format('HH:mm') || '';
                    onTimeSlotChange(index, "endTime", timeString);
                  }}
                
                />
            </div>
            <button
              onClick={() => onRemoveTimeSlot(index)}
              className="mt-6 text-red-500 hover:text-red-700 pr-6"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddTimeSlot}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-700"
        >
          <Plus size={20} />
          <span>Add Time Slot</span>
        </button>
      </div>
    </div>
  );
};