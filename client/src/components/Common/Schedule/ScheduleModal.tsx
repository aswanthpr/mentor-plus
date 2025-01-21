import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Button from '../../Auth/Button';
import Modal from '../common4All/Modal';
import { ScheduleTypeSelector } from './ScheduleTypeSelector';
import { RecurringScheduleForm } from './RecurringScheduleForm';
import TimePickers from './TimePickers';
import dayjs from 'dayjs';

interface TimeSlot {
    startTime: string;
    endTime: string;
  }
  
  interface DaySchedule {
    slots: TimeSlot[];
    price: string;
  }
  
  interface BlockedDate {
    date: string;
  }
  
  interface RecurringSchedule {
    startDate: string;
    endDate: string;
    timeSlots: TimeSlot[];
    selectedDays: string[];
    price: string;
  }
  
  interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {

  const [scheduleType, setScheduleType] = useState<'normal' | 'recurring'>('normal');
  const [normalSchedule, setNormalSchedule] = useState<DaySchedule[]>(
    Array(7).fill(null).map(() => ({
      slots: [{ startTime: "", endTime: "" }],
      price: ""
    }))
  );
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule>({
    startDate: "",
    endDate: "",
    timeSlots: [{ startTime: "", endTime: "" }],
    selectedDays: [],
    price: ""
  });
//   const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

const handleNormalTimeChange = (
    dayIndex: number,
    slotIndex: number,
    key: keyof TimeSlot,
    value: string
  ) => {
    const updated = [...normalSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: updated[dayIndex].slots.map((slot, idx) =>
        idx === slotIndex ? { ...slot, [key]: value } : slot
      )
    };
    setNormalSchedule(updated);
  };

  const handleNormalPriceChange = (dayIndex: number, price: string) => {
    const updated = [...normalSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      price
    };
    setNormalSchedule(updated);
  };

  const handleRecurringTimeChange = (
    slotIndex: number,
    key: keyof TimeSlot,
    value: string
  ) => {
    setRecurringSchedule({
      ...recurringSchedule,
      timeSlots: recurringSchedule.timeSlots.map((slot, index) =>
        index === slotIndex ? { ...slot, [key]: value } : slot
      ),
    });
  };

  const addNormalTimeSlot = (dayIndex: number) => {
    const updated = [...normalSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: [...updated[dayIndex].slots, { startTime: "", endTime: "" }]
    };
    setNormalSchedule(updated);
  };

  const addRecurringTimeSlot = () => {
    setRecurringSchedule({
      ...recurringSchedule,
      timeSlots: [...recurringSchedule.timeSlots, { startTime: "", endTime: "" }],
    });
  };

  const removeNormalTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...normalSchedule];
    if (updated[dayIndex].slots.length > 1) {
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: updated[dayIndex].slots.filter((_, index) => index !== slotIndex)
      };
      setNormalSchedule(updated);
    }
  };

  const removeRecurringTimeSlot = (slotIndex: number) => {
    if (recurringSchedule.timeSlots.length > 1) {
      setRecurringSchedule({
        ...recurringSchedule,
        timeSlots: recurringSchedule.timeSlots.filter((_, index) => index !== slotIndex),
      });
    }
  };

  const toggleRecurringDay = (day: string) => {
    const updated = recurringSchedule.selectedDays.includes(day)
      ? recurringSchedule.selectedDays.filter(d => d !== day)
      : [...recurringSchedule.selectedDays, day];
    setRecurringSchedule({ ...recurringSchedule, selectedDays: updated });
  };

//   const addBlockedDate = () => {
//     setBlockedDates([...blockedDates, { date: "" }]);
//   };

//   const addBlockedDate = () => {
//     setBlockedDates([...blockedDates, { date: "" }]);
//   };

//   const removeBlockedDate = (index: number) => {
//     setBlockedDates(blockedDates.filter((_, i) => i !== index));
//   };

//   const updateBlockedDate = (index: number, date: string) => {
//     const validDate = date ? date : ""; 
//     const updated = [...blockedDates];
//     updated[index] = { date: validDate };
//     setBlockedDates(updated);
//   };

const handleSave = () => {
    const scheduleData = {
      type: scheduleType,
      schedule: scheduleType === 'normal' ? normalSchedule : recurringSchedule,
    //   blockedDates,
    };
    console.log('Schedule Data:', scheduleData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto ">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold ">Schedule Availability</h2>
         
        </div>

        <ScheduleTypeSelector value={scheduleType} onChange={setScheduleType} />

        {scheduleType === 'normal' ? (
          <div className="space-y-6">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">{day}</h3>
                  <div className="w-1/3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Price for {day}
                    </label>
                    <input
                      type="text"
                      value={normalSchedule[dayIndex].price}
                      onChange={(e) => handleNormalPriceChange(dayIndex, e.target.value)}
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
                    />
                  </div>
                </div>
                {normalSchedule[dayIndex].slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Start Time
                      </label>

                      <TimePickers
                          value={slot.startTime ? dayjs(slot.startTime, 'HH:mm') : null}
                          onChange={(newValue) => {
                            const timeString = newValue?.format('HH:mm') || '';
                            handleNormalTimeChange(dayIndex, slotIndex, "startTime", timeString);
                          }}
                          slotProps={{ textField: { size: 'small' } }}
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
                            handleNormalTimeChange(dayIndex, slotIndex, "endTime", timeString);
                          }}
                          slotProps={{ textField: { size: 'small' } }}
                        />
                    </div>
                    <button
                      onClick={() => removeNormalTimeSlot(dayIndex, slotIndex)}
                      className="mt-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addNormalTimeSlot(dayIndex)}
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-700 mt-2"
                >
                  <Plus size={20} />
                  <span>Add Time Slot</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <RecurringScheduleForm
            startDate={recurringSchedule.startDate}
            endDate={recurringSchedule.endDate}
            price={recurringSchedule.price}
            selectedDays={recurringSchedule.selectedDays}
            timeSlots={recurringSchedule.timeSlots}
            onStartDateChange={(date) => setRecurringSchedule({ ...recurringSchedule, startDate: date })}
            onEndDateChange={(date) => setRecurringSchedule({ ...recurringSchedule, endDate: date })}
            onPriceChange={(price) => setRecurringSchedule({ ...recurringSchedule, price })}
            onDayToggle={toggleRecurringDay}
            onAddTimeSlot={addRecurringTimeSlot}
            onRemoveTimeSlot={removeRecurringTimeSlot}
            onTimeSlotChange={handleRecurringTimeChange}
          />
        )}

        {/* <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Blocked Dates</h3>
            <button
              onClick={addBlockedDate}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-700"
            >
              <Calendar size={20} />
              <span>Add Blocked Date</span>
            </button>
          </div> */}
          {/* <div className="space-y-2">
            {blockedDates.map((blocked, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="date"
                  multiple={true}
                  value={blocked.date}
                  onChange={(e) => updateBlockedDate(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
                />
                <button
                  onClick={() => removeBlockedDate(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div> */}
        {/* </div> */}

        <div className="mt-6">
          <Button
            variant="orange"
            className="w-full font-bold"
            onClick={handleSave}
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};