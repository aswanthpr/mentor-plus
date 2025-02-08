import moment, { Moment } from "moment";
import   { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import MuiInput from "./MuiInput";
import Button from "../../Auth/Button";
import Modal from "../common4All/Modal";
import TimePickers from "./TimePickers";
import DatePickers from "./DatePickers";
import { ScheduleTypeSelector } from "./ScheduleTypeSelector";
import { RecurringScheduleForm } from "./RecurringScheduleForm";





export const ScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ScheduleModalProps) => {
  const [scheduleType, setScheduleType] = useState<"normal" | "recurring">(
    "normal"
  );

  // Initialize normalSchedule as an empty array
  const [normalSchedule, setNormalSchedule] = useState<DaySchedule[]>([]);
  const [recurringSchedule, setRecurringSchedule] = useState<ISchedule>({
    startDate: "",
    endDate: "",
    slots: [{ startTime: "", endTime: "" }],
    selectedDays: [],
    price: "",
  });

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleDateSelection = (date: string) => {

    if (selectedDates.length < 7 && !selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date]);

      setNormalSchedule([
        ...normalSchedule,
        {
          slots: [{ startTime: "", endTime: "" }],
          price: "",
          startDate: date,
        },
      ]);
    }
  };

  const removeDate = (date: string) => {
    setSelectedDates(
      selectedDates.filter((selectedDate) => selectedDate !== date)
    );
    setNormalSchedule(
      normalSchedule.filter((schedule) => schedule.startDate !== date)
    );
  };

  const handleNormalTimeChange = (
    dayIndex: number,
    slotIndex: number,
    key: keyof TimeSlot,
    value: string
  ) => {
    console.log(value,'timeString',typeof value)
    const updated = [...normalSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: updated[dayIndex].slots.map((slot, idx) =>
        idx === slotIndex ? { ...slot, [key]: value } : slot
      ),
    };
    setNormalSchedule(updated);
  };

  const handleNormalPriceChange = (dayIndex: number, price: string) => {
    const updated = [...normalSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      price,
    };
    setNormalSchedule(updated);
  };

  const addNormalTimeSlot = (dayIndex: number) => {
    const updated = [...normalSchedule];
    if (updated[dayIndex].slots.length < 10) {
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: [...updated[dayIndex].slots, { startTime: "", endTime: "" }],
      };
      setNormalSchedule(updated);
    } else {
      toast.warning("You can only add up to 10 time slots.");
    }
  };

  const removeNormalTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...normalSchedule];
    if (updated[dayIndex].slots.length > 1) {
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: updated[dayIndex].slots.filter(
          (_, index) => index !== slotIndex
        ),
      };
      setNormalSchedule(updated);
    }
  };

  const handleSave = () => {
    const cleanNormalSchedule = normalSchedule
      .map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => slot.startTime && slot.endTime),
      }))
      .filter((day) => day.slots.length > 0 || day.price);


    const scheduleData = {
      type: scheduleType,
      schedule:
        scheduleType === "normal"
          ? cleanNormalSchedule
          : recurringSchedule,
    };

    console.log("Cleaned Schedule Data:", scheduleData);
    onSubmit(scheduleData as unknown as ISchedule);
    onClose();
  };

  const toggleRecurringDay = (day: string) => {
    const updatedDays = recurringSchedule?.selectedDays?.includes(day)
      ? recurringSchedule?.selectedDays.filter((d) => d !== day)
      : [...recurringSchedule.selectedDays!, day];

    setRecurringSchedule({ ...recurringSchedule, selectedDays: updatedDays });
  };

  const addRecurringTimeSlot = () => {
    setRecurringSchedule({
      ...recurringSchedule,
      slots: [...recurringSchedule.slots, { startTime: "", endTime: "" }],
    });
  };

  const handleTimeSlotChange = (
    index: number,
    key: keyof TimeSlot,
    value: string
  ) => {
    const updatedTimeSlots = [...recurringSchedule.slots];
    updatedTimeSlots[index] = { ...updatedTimeSlots[index], [key]: value };
    setRecurringSchedule({ ...recurringSchedule, slots: updatedTimeSlots });
  };

  const removeRecurringTimeSlot = (index: number) => {
    const updatedTimeSlots = recurringSchedule.slots.filter(
      (_, idx) => idx !== index
    );
    setRecurringSchedule({ ...recurringSchedule, slots: updatedTimeSlots });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto ">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold ">Schedule Availability</h2>
        </div>

        <ScheduleTypeSelector
          value={scheduleType}
          onChange={setScheduleType}
          classNames={"pr-6 w-full"}
        />

        {scheduleType === "normal" ? (
          <div className="space-y-6 pr-6">
            <div className="mb-4">
            <DatePickers
            className="w-full"
                disablePast
                format="DD-MM-YYYY"
                label="Select Dates"
        
                value={null}
                onChange={(newValue: Moment | null) => {
              
                  if (newValue) {
                    const formattedDate = newValue.format("YYYY-MM-DD"); 
                    // console.log(formattedDate,'formattedDate')
                    handleDateSelection(formattedDate);
                  } else {
                    handleDateSelection(''); 
                  }
                }}
                

            />
              
              <div className="mt-2 flex gap-2">
                {selectedDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-semibold">{date}</span>
                    <button
                      onClick={() => removeDate(date)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedDates.map((date, dateIndex) => (
              <div key={date} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-start items-center mb-4 pr-6">
                  <div className="w-auto">
                  <MuiInput
                   label= {`price of ${date.split('-').reverse().join('-')}`}
                   type="text"
                   value={normalSchedule[dateIndex]?.price}
                   onChange={(e) =>
                     handleNormalPriceChange(dateIndex, e.target.value)
                   }
                   placeholder="Enter price"
                   className="ml-0 pl-0"
                   min={0}
                   />        
                  </div>
                </div>

                {normalSchedule[dateIndex]?.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-1 mb-2">
                    <div className="flex-1 w-full sm:w-1/2 md:w-1/3">
                      <TimePickers
                        label="StartTime"
                        value={
                          slot.startTime ? moment(slot.startTime, "hh:mm A") : null
                        }
                        onChange={(newValue) => {
                          const timeString = newValue?.format("HH:mm:ss") || ""; // Format for display (AM/PM)
                          handleNormalTimeChange(
                            dateIndex,
                            slotIndex,
                            "startTime",
                            timeString
                          );
                          console.log(timeString,'timeString',newValue)
                        }}
                      />
                    </div>

                    <div className="flex-1 w-full xss:w-1/6 md:w-1/3 xss:flex ">
                      <TimePickers
                      
                        label="EndTime"
                        value={
                          slot.endTime ? moment(slot.endTime,"hh:mm A") : null
                        }
                        onChange={(newValue) => {
                          const timeString = newValue?.format("HH:mm:ss") || "";
                          
                          handleNormalTimeChange(
                            dateIndex,
                            slotIndex,
                            "endTime",
                            timeString
                          );
                        }}
                      />

                      {slotIndex >=
                        normalSchedule[dateIndex]?.slots.length - 1 && (
                        <button
                          onClick={() =>
                            removeNormalTimeSlot(dateIndex, slotIndex)
                          }
                          className={`mt-6 text-red-500 hover:text-red-700 pl-4 ${
                            slotIndex == 0 ? "hidden" : "visible"
                          }`}
                        >
                          <Trash2 className="h-5 xss:w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {normalSchedule[dateIndex]?.slots.length < 10 && (
                  <button
                    onClick={() => addNormalTimeSlot(dateIndex)}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-700 mt-4 "
                    disabled={normalSchedule[dateIndex].slots.length >= 10}
                  >
                    <Plus size={20} />
                    <span>Add Time Slot</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <RecurringScheduleForm
            startDate={recurringSchedule.startDate}
            endDate={recurringSchedule["endDate"]!}
            price={recurringSchedule.price}
            selectedDays={recurringSchedule.selectedDays!}
            timeSlots={recurringSchedule.slots}
            onStartDateChange={(date) =>
              setRecurringSchedule({ ...recurringSchedule, startDate: date })
            }
            onEndDateChange={(date) =>
              setRecurringSchedule({ ...recurringSchedule, endDate: date })
            }
            onPriceChange={(price) =>
              setRecurringSchedule({ ...recurringSchedule, price })
            }
            onDayToggle={toggleRecurringDay}
            onAddTimeSlot={addRecurringTimeSlot}
            onRemoveTimeSlot={removeRecurringTimeSlot}
            onTimeSlotChange={handleTimeSlotChange}
          />
        )}

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
