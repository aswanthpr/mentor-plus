import moment, { Moment } from "moment";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import MuiInput from "./MuiInput";
import Button from "../../Auth/Button";
import Modal from "../common4All/Modal";
import TimePickers from "./TimePickers";
import DatePickers from "./DatePickers";
import { ScheduleTypeSelector } from "./ScheduleTypeSelector";
import { RecurringScheduleForm } from "./RecurringScheduleForm";
import {
  baseScheduleSchema,
  scheduleSchema,
  timeSlotSchema,
} from "../../../Validation/yupValidation";
import * as Yup from "yup";
import { ValidatingIsOverlapping } from "../../../Validation/Validation";
import { RECURRING_SCHEDULE_INITIAL } from "../../../Constants/initialStates";
import { Messages } from "../../../Constants/message";

export const ScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ScheduleModalProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [scheduleType, setScheduleType] = useState<TscheduleType>("normal");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [normalSchedule, setNormalSchedule] = useState<DaySchedule[]>([]);
  const [recurringSchedule, setRecurringSchedule] = useState<ISchedule>(
    RECURRING_SCHEDULE_INITIAL
  );

  const handleDateSelection = useCallback(
    (date: string) => {
      if (selectedDates.length < 7 &&!selectedDates.includes(date)) {//first one
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
    },
    [normalSchedule, selectedDates]
  );

  const removeDate = useCallback(
    (date: string) => {
      setSelectedDates(
        selectedDates.filter((selectedDate) => selectedDate !== date)
      );
      setNormalSchedule(
        normalSchedule.filter((schedule) => schedule?.startDate !== date)
      );
    },
    [normalSchedule, selectedDates]
  );

  const handleNormalTimeChange = useCallback(
    (
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
        ),
      };
      setNormalSchedule(updated);
    },
    [normalSchedule]
  );

  const handleNormalPriceChange = useCallback(
    (dayIndex: number, price: string) => {
      setNormalSchedule((prev) => {
        const updated = [...prev];

        updated[dayIndex].price = price ?? "";
        return updated;
      });
    },
    []
  );

  const addNormalTimeSlot = useCallback(
    (dayIndex: number) => {
      const updated = [...normalSchedule];
      if (updated[dayIndex].slots.length < 10) {
        updated[dayIndex] = {
          ...updated[dayIndex],
          slots: [...updated[dayIndex].slots, { startTime: "", endTime: "" }],
        };
        setNormalSchedule(updated);
      } else {
        toast.warning(Messages?.NORMAL_TIMESLOT_LIMIT);
      }
    },
    [normalSchedule]
  );

  const removeNormalTimeSlot = useCallback(
    (dayIndex: number, slotIndex: number) => {
      const updated = [...normalSchedule];
      if (updated[dayIndex].slots.length > 1) {
        updated[dayIndex] = {
          ...updated[dayIndex],
          slots: updated[dayIndex].slots.filter(
            (_, index) => index !== slotIndex
          ),
        };
        setNormalSchedule(updated);
        const errorKey = `normalSchedule[${dayIndex}].slots[${slotIndex}].${slotIndex}`;
        if (errors[errorKey]) {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[errorKey];
            return newErrors;
          });
        }
      }
    },
    [errors, normalSchedule]
  );

  const handleSave = useCallback(async () => {
    setErrors({});
    const validationErrors: Record<string, string> = {};

    if (scheduleType === "normal") {
      // Validate normal schedule entries
      await Promise.all(
        normalSchedule.map(async (slot, index) => {
          try {
            await baseScheduleSchema.validate(slot, { abortEarly: false });
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              err.inner.forEach((error) => {
                validationErrors[`normalSchedule[${index}].${error.path}`] =
                  error.message;
              });
            }
          }

          if (ValidatingIsOverlapping(slot?.slots)) {
            validationErrors[`normalSchedule[${index}].slots}`] =
              "Time slots cannot overlap";
            toast.error(Messages?.TIME_SLOT_CANNOT_OVERLAP);
          }

          // Validate each time slot inside normal schedule
          await Promise.all(
            slot.slots.map(async (time, slotIndex) => {
              try {
                await timeSlotSchema.validate(time, { abortEarly: false });
              } catch (err) {
                if (err instanceof Yup.ValidationError) {
                  err.inner.forEach((error) => {
                    validationErrors[
                      `normalSchedule[${index}].slots[${slotIndex}].${error.path}`
                    ] = error.message;
                  });
                }
              }
            })
          );
        })
      );
    } else {
      // Validate recurring schedule
      try {
        await scheduleSchema.validate(recurringSchedule, { abortEarly: false });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((error) => {
            validationErrors[`recurringSchedule.${error.path}`] = error.message;
          });
        }
      }

      // Validate time slots inside recurring schedule
      await Promise.all(
        recurringSchedule.slots.map(async (slot, slotIndex) => {
          try {
            await timeSlotSchema.validate(slot, { abortEarly: false });
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              err.inner.forEach((error) => {
                validationErrors[
                  `recurringSchedule.slots[${slotIndex}].${error.path}`
                ] = error.message;
              });
            }
          }
        })
      );

      // Validate selectedDays array
      if (recurringSchedule?.selectedDays?.length === 0) {
        validationErrors["recurringSchedule.selectedDays"] =
          "At least one day must be selected";
      }
    }

    // If validation errors exist, update state & stop submission

    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation Errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    const cleanNormalSchedule = normalSchedule
      .map((day) => ({
        ...day,
        slots: day?.slots.filter((slot) => slot?.startTime && slot?.endTime),
      }))
      .filter((day) => day?.slots.length > 0 || day?.price);

    const scheduleData = {
      type: scheduleType,
      schedule:
        scheduleType === "normal" ? cleanNormalSchedule : recurringSchedule,
    };

    onSubmit(scheduleData as unknown as ISchedule);
    onClose();
    setSelectedDates([]);
    setNormalSchedule([]);
    setRecurringSchedule(RECURRING_SCHEDULE_INITIAL);
  }, [normalSchedule, onClose, onSubmit, recurringSchedule, scheduleType]);

  const toggleRecurringDay = useCallback(
    (day: string) => {
      const updatedDays = recurringSchedule?.selectedDays?.includes(day)
        ? recurringSchedule?.selectedDays.filter((d) => d !== day)
        : [...recurringSchedule.selectedDays!, day];

      setRecurringSchedule({ ...recurringSchedule, selectedDays: updatedDays });
    },
    [recurringSchedule]
  );

  const addRecurringTimeSlot = useCallback(() => {
    setRecurringSchedule({
      ...recurringSchedule,
      slots: [...recurringSchedule.slots, { startTime: "", endTime: "" }],
    });
  }, [recurringSchedule]);

  const handleTimeSlotChange = useCallback(
    (index: number, key: keyof TimeSlot, value: string) => {
      const updatedTimeSlots = [...recurringSchedule.slots];
      updatedTimeSlots[index] = { ...updatedTimeSlots[index], [key]: value };
      setRecurringSchedule({ ...recurringSchedule, slots: updatedTimeSlots });
    },
    [recurringSchedule]
  );

  const removeRecurringTimeSlot = useCallback(
    (index: number) => {
      const updatedTimeSlots = recurringSchedule.slots.filter(
        (_, idx) => idx !== index
      );
      setRecurringSchedule({ ...recurringSchedule, slots: updatedTimeSlots });
    },
    [recurringSchedule]
  );

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

                    handleDateSelection(formattedDate);
                  } else {
                    handleDateSelection("");
                  }
                }}
              />
              {errors["selectedDates"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["selectedDates"]}
                </p>
              )}

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
                      label={`price of ${date.split("-").reverse().join("-")}`}
                      type="text"
                      value={normalSchedule[dateIndex]?.price as string}
                      onChange={(e) =>
                        handleNormalPriceChange(dateIndex, e.target?.value)
                      }
                      placeholder="Enter price"
                      className="ml-0 pl-0"
                      min={0}
                    />
                    {errors[`normalSchedule[${dateIndex}].price`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`normalSchedule[${dateIndex}].price`]}
                      </p>
                    )}
                  </div>
                </div>

                {normalSchedule[dateIndex]?.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-1 mb-2">
                    <div className="flex-1 w-full sm:w-1/2 md:w-1/3">
                      <TimePickers
                        label="StartTime"
                        value={
                          slot.startTime
                            ? moment(slot.startTime, "hh:mm A")
                            : null
                        }
                        onChange={(newValue) => {
                          const timeString = newValue?.format("HH:mm:ss") || ""; // Format for display (AM/PM)
                          handleNormalTimeChange(
                            dateIndex,
                            slotIndex,
                            "startTime",
                            timeString
                          );
                        }}
                      />
                      {errors[
                        `normalSchedule[${dateIndex}].slots[${slotIndex}].startTime`
                      ] && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[
                              `normalSchedule[${dateIndex}].slots[${slotIndex}].startTime`
                            ]
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex-1 w-full xss:w-1/6 md:w-1/3 xss:flex ">
                      <div className="flex flex-col">
                        <TimePickers
                          label="EndTime"
                          value={
                            slot.endTime
                              ? moment(slot.endTime, "hh:mm A")
                              : null
                          }
                          onChange={(newValue) => {
                            const timeString =
                              newValue?.format("HH:mm:ss") || "";

                            handleNormalTimeChange(
                              dateIndex,
                              slotIndex,
                              "endTime",
                              timeString
                            );
                          }}
                        />
                        {errors[
                          `normalSchedule[${dateIndex}].slots[${slotIndex}].endTime`
                        ] && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors[
                                `normalSchedule[${dateIndex}].slots[${slotIndex}].endTime`
                              ]
                            }
                          </p>
                        )}
                      </div>
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
            errors={errors}
            startDate={recurringSchedule.startDate}
            endDate={recurringSchedule["endDate"]!}
            price={recurringSchedule.price as number}
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
            disabled={
              scheduleType == "normal"
                ? !normalSchedule[0]
                : recurringSchedule.slots.length < 0
            }
            onClick={handleSave}
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};
