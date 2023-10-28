import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const DepartmentSelect = ({ value, onChange}) => {
  return (
    <TextField
      select

      label="Select Department"
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
    >
      <MenuItem value="it">Information Technology</MenuItem>
      <MenuItem value="mea">Mechanical Engineering A</MenuItem>
      <MenuItem value="meb">Mechanical Engineering B</MenuItem>
      <MenuItem value="ee">Electrical Engineering</MenuItem>
      <MenuItem value="extc">EXTC</MenuItem>
      <MenuItem value="cea">Computer Engineering A</MenuItem>
      <MenuItem value="ceb">Computer Engineering B</MenuItem>
    </TextField>
  );
};

export default DepartmentSelect;