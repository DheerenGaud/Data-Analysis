import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import Navigationbar from '../components/Navbar';
import Appbar from '../components/Appbar';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import StudentTable from './studenttable';
import {studentByAcdmicYear} from "../api/api"


export default function SelectBatch() {

      
  const [open, setOpen] = React.useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [students,setStudent]=useState([]);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [data, setData] = useState({
    Departname: '',
    startYear: null,
    End_Year: null,
  });

  const handleDepartmentChange = (event) => {
    const newDepartment = event.target.value;
    setData((prevData) => ({
      ...prevData,
      Departname: newDepartment,
    }));
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
    console.log(formattedDate);
    setData((prevData) => ({
      ...prevData,
      Start_Year: formattedDate, // Update Start_YearMonth with the formatted date
      End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && data.Departname && data.startYear) {
      handleBatchSubmit();
    }
  };

  const handleBatchSubmit = async() => {
    const x= await studentByAcdmicYear(data)
    if(x.data.status=="ok"){
      console.log(x.data);
      setSubmitted(true);
      setStudent(x.data.data)
    }
  };


  return (
    
    <Grid container justifyContent="center" spacing={2}>
  
      {submitted ? ( 
        <Box sx={{ display: 'flex' }}>

          <Appbar pageName='Edit batch' open={open} handleDrawerOpen={handleDrawerOpen} />
          <Navbar open={open} handleDrawerClose={handleDrawerClose} />
          <Box component="main" sx={{ flexGrow: 1, p: 15}}>
          <Grid container justifyContent="center">
          <Grid item xs={12}>
          <StudentTable allStudent={students} data={data}></StudentTable>
          </Grid>
          </Grid>
          </Box>

        </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
  <Appbar pageName='Edit batch' open={open} handleDrawerOpen={handleDrawerOpen} />
  <Navbar open={open} handleDrawerClose={handleDrawerClose} />
  <Box component="main" sx={{ flexGrow: 1, p: 15 }}>
    <Typography variant="h5" align="center" gutterBottom>
      Select Batch
    </Typography>
    <Box width="50vw" sx={{ display: 'flex' }}>
      <Paper elevation={3} sx={{ flexGrow: 1, p: 6 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={6}>
            <DepartmentSelect value={data.Departname} onChange={handleDepartmentChange} />
          </Grid>
          <Grid item xs={12} md={6} className='pageStyle'>
            <MonthYearSelect value={data.startYear} onChange={handleDateChange} onKeyDown={handleKeyDown} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Button variant="contained" color="primary" onKeyDown={handleKeyDown} onClick={handleBatchSubmit} fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </Box>
</Box>
        )}

    </Grid>
  );
}