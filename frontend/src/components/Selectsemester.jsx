import { TextField, MenuItem } from '@mui/material';
import MonthYearSelect from '../components/Selectmonthyear';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';


const SemesterSelect = ({ value, onChange ,onChangeintrY,intrY,extrY,onChangeextrY}) => {
    return (
      <>

<Grid container spacing={1} justifyContent="center">
        <Grid item xs={5}>

    <TextField
      select
      label="Select Semester"
      name="SemNo"
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      >
      <MenuItem value={1}>Semester 1</MenuItem>
      <MenuItem value={2}>Semester 2</MenuItem>
      <MenuItem value={3}>Semester 3</MenuItem>
      <MenuItem value={4}>Semester 4</MenuItem>
      <MenuItem value={5}>Semester 5</MenuItem>
      <MenuItem value={6}>Semester 6</MenuItem>
      <MenuItem value={7}>Semester 7</MenuItem>
      <MenuItem value={8}>Semester 8</MenuItem>
    </TextField>



        </Grid>
        <Grid container spacing={2} justifyContent="center"></Grid>
        <Grid item xs={5}>
          <MonthYearSelect name="InternalYear"  value={intrY} onChange={onChangeintrY} />
        </Grid>
        <Grid item xs={5}>
          <MonthYearSelect name="ExternalYear"  value={extrY} onChange={onChangeextrY} />
        </Grid>

        </Grid>
   
      </>
    
  );
};

export default SemesterSelect;