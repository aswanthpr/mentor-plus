import React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';


interface ReusableTimePickerProps {
  label?: string; // Label for the TimePicker
  value: Dayjs | null; // Selected time value
  onChange: (newValue: Dayjs | null) => void; // Callback when time changes
  ampm?: boolean; // Whether to show AM/PM format
  minutesStep?: number; // Interval for minutes selection
}

const TimePickers: React.FC<ReusableTimePickerProps> = ({
  label = 'Select Time',
  value,
  onChange,
  ampm = true,
  minutesStep = 1,
}) => {
  // Handle the change event for TimePicker
  const handleChange = (newValue: Dayjs | null) => {
    onChange(newValue); // Pass the new value to the parent
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiTimePicker
        label={label}
        value={value}
        onChange={handleChange}
        ampm={ampm}
        minutesStep={minutesStep}
      />
    </LocalizationProvider>
  );
};

export default TimePickers;
