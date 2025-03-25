import React from "react";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Moment } from "moment";

interface ReusableTimePickerProps {
  label?: string; // Label for the TimePicker
  value: Moment | null; // Selected time value
  onChange: (newValue: Moment | null) => void; // Callback when time changes
  ampm?: boolean; // Whether to show AM/PM format
  minutesStep?: number; // Interval for minutes selection
}

const TimePickers: React.FC<ReusableTimePickerProps> = ({
  label = "Select Time",
  value,
  onChange,
  ampm = true,
  minutesStep = 1,
}) => {
  // Handle the change event for TimePicker
  const handleChange = (newValue: Moment | null) => {
    onChange(newValue);
  };

  return (
    <TimePicker
      label={label}
      value={value}
      onChange={handleChange}
      ampm={ampm}
      minutesStep={minutesStep}
    />
  );
};

export default TimePickers;
