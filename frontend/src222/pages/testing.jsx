import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MonthPicker } from '@mui/x-date-pickers/MonthPicker'; // Updated import

export default function ResponsiveDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'MonthPicker', // Updated component
        ]}
      >
        <DemoItem label="Responsive variant">
          <MonthPicker defaultValue={dayjs('2022-04-17')} /> // Updated component
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}