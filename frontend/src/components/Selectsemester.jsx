import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const SemesterSelect = ({ value, onChange }) => {
    return (
    <TextField
      select
      label="Select Semester"
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
    >
      <MenuItem value="sem 1">Semester 1</MenuItem>
      <MenuItem value="sem 2">Semester 2</MenuItem>
      <MenuItem value="sem 3">Semester 3</MenuItem>
      <MenuItem value="sem 4">Semester 4</MenuItem>
      <MenuItem value="sem 5">Semester 5</MenuItem>
      <MenuItem value="sem 6">Semester 6</MenuItem>
      <MenuItem value="sem 7">Semester 7</MenuItem>
      <MenuItem value="sem 8">Semester 8</MenuItem>
    </TextField>
  );
};

export default SemesterSelect;