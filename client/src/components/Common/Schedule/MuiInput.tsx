import React from "react";
import { FormControl, InputLabel, OutlinedInput, InputProps } from "@mui/material";

interface CustomInputProps extends InputProps {
  label: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?:number
}

const MuiInput: React.FC<CustomInputProps> = ({
  label,
  startAdornment,
  endAdornment,
  value,
  onChange,
  type = "text",
  min,
  
  ...props
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel htmlFor="custom-input">{label}</InputLabel>
      <OutlinedInput
        id="custom-input"
        value={value??""}
        onChange={onChange}
        label={label}
        type={type}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        inputProps={{min}}
        error
        {...props}  
      />
    </FormControl>
  );
};

export default MuiInput;
