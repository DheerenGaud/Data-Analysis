import React, { useState } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Appbar from '../components/Appbar';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import { Grid, Button, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, MenuItem, Select, InputLabel, Paper } from '@mui/material';


const genderItems = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' },
  { id: 'other', title: 'Other' },
]


export default function Uploaddata() {
  const [open, setOpen] = React.useState(false);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
const [data, setData] = useState({
  startYear: null,
  endYear: null,
  department: '',
  fullName: '',
  gender: '',
});

const handleDateChange = (date) => {
  const selectedYear = dayjs(date).format('YYYY');
  setData((prevData) => ({
    ...prevData,
    startYear: Number(selectedYear),
    endYear: Number(selectedYear) + 4,
  }));
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  setData((prevData) => ({
    ...prevData,
    file: file
  }));
};

const handleDepartmentChange = (event) => {
  const newDepartment = event.target.value;
  setData((prevData) => ({
    ...prevData,
    department: newDepartment,
  }));
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && data.department && data.startYear) {
    handleBatchSubmit();
  }
};

const handleBatchSubmit = () => {
  if (!data.department) {
    console.log("Please enter the department.");
  } else if (!data.startYear) {
    console.log("Please enter the month and year");
  } else {
    console.log(data);
  }
};


const handleNameChange = (event) => {
  const newName = event.target.value;
  setData((prevData) => ({
    ...prevData,
    fullName: newName,
  }));
};

const handleGenderChange = (event) => {
  const newGender = event.target.value;
  setData((prevData) => ({
    ...prevData,
    gender: newGender,
  }));
};

  return (
    <Box sx={{ display: 'flex' }}>
    <Appbar pageName='Upload Data' open={open} handleDrawerOpen={handleDrawerOpen} />
    <Navbar open={open} handleDrawerClose={handleDrawerClose} />
    <Box component="main" sx={{ flexGrow: 1, p: 10}}>
          <Paper elevation={3} sx={{ flexGrow: 1, p: 5}}>
            <form onSubmit={handleBatchSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="fullName"
                    label="Full Name"
                    value={data.fullName}
                    onChange={handleNameChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      name="gender"
                      value={data.gender}
                      onChange={handleGenderChange}
                    >
                      {genderItems.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          control={<Radio />}
                          label={item.title}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <DepartmentSelect value={data.department} onChange={handleDepartmentChange} />
                </Grid>
                <Grid item xs={12}>
                  <MonthYearSelect value={data.startYear} onChange={handleDateChange} onKeyDown={handleKeyDown} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onKeyDown={handleKeyDown} onClick={handleBatchSubmit} fullWidth>
                    Submit
                  </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
          </Box>
    </Box>
  )
}


