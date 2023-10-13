import React, { useRef, useState } from 'react';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import Appbar from '../components/Appbar';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';


import {DownlodExcel} from "../api/api"


export default function Downloaddata() {
      
  const [open, setOpen] = React.useState(false);

  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [data, setData] = useState({
    Departname: '',
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
      End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && data.Departname && data.startYear) {
      handleBatchSubmit();
    }
  };
 

  // const handleBatchSubmit = async() => {
  //   const x= await DownlodExcel(data);
  // };
  const handleBatchSubmit = async () => {
    try {
      const response = await DownlodExcel(data);
      
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary <a> element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_marks.xlsx';
      
      // Trigger a click on the <a> element to start the download
      a.click();
      
      // Release the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };


  return (
    
    <Grid container justifyContent="center" spacing={2}>
  
  
          <Box sx={{ display: 'flex' }}>
  <Appbar pageName='Download Data' open={open} handleDrawerOpen={handleDrawerOpen} />
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
              Download
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </Box>
</Box>
     

    </Grid>
  );
}