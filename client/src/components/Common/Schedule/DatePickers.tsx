import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Moment } from 'moment';

const DatePickers = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  shouldDisableDate,
  format,
  className
}: {
  label: string;
  value?: Moment | null;
  onChange: (newValue: Moment | null) => void;
  minDate?: Moment;
  maxDate?: Moment;
  disablePast: boolean;
  shouldDisableDate?: (date: Moment) => boolean;
  format: string;
  className?:string

}) => {
  return (
    <>
    <DatePicker
    className={className}
      label={label}
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      disablePast={true}
      shouldDisableDate={shouldDisableDate}
      format={format}
      onChange={onChange} 
    
    />
    </>
  );
};

export default DatePickers;
