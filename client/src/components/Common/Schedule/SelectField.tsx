import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// Define the types for the component props
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
  placeholder: string;
  classNames?:string
}

const SelectField: React.FC<SelectFieldProps> = ({classNames, label, value, onChange, options, placeholder }) => {
  return (
    <FormControl fullWidth variant="outlined"  >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        className={`${classNames} `}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
