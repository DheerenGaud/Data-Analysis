import React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MonthYearSelect = ({ value, onChange, onKeyDown }) => {


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        selectstartYear
        label="MM/YYYY"
        onChange={onChange}
        views={['year', 'month']}
        openTo="year"
        inputFormat="MM/YYYY"
        onKeyDown={onKeyDown}
        sx={{ width: '100%', margin: '0 auto' }}
      />
    </LocalizationProvider>
  );
};

export default MonthYearSelect;