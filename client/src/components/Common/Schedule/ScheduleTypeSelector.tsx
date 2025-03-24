import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";



  export const ScheduleTypeSelector = ({ value, onChange,classNames }: ScheduleTypeSelectorProps) => {
    return (
      <div className={`mb-6 ${classNames}` }>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Schedule Type</InputLabel>
        <Select
          label="Schedule Type"  // Ensure the label prop is passed here
          value={value}
          onChange={(e) => onChange(e.target.value as 'normal' | 'recurring')}
          className=" border border-none rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="recurring">Recurring</MenuItem>
        </Select>
      </FormControl>
      </div>
    );
  };




