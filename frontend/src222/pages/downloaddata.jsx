import React, { useRef, useState } from 'react';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import Appbar from '../components/Appbar';
import Navbar from '../components/Navbar';
import { TextField, MenuItem } from '@mui/material';

import dayjs from 'dayjs';


import {DownlodExcel,downloadGetData} from "../api/api"


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
    document:"",
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
 

  const handleChangeDownload = async(e) => {
    setData((prevData) => ({
      ...prevData,
      document: e.target.value,
    }));
  };


  const handleBatchSubmit = async () => {
    if(data.document!==""&&data.End_Year!==null&&data.Departname!==""){
      try {
        if(data.document==="generate-excel"){
          const response = await DownlodExcel(data);
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'student_marks.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }
        else{
          console.log(data);
            const response=await downloadGetData(data);
        if (response.status == 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });
          
              const url = window.URL.createObjectURL(blob);
              const filename = `${data.Departname}_${data.End_Year}_academic-report-${data.document}.pdf`;
              const a = document.createElement('a');
              a.href = url;
              a.download = `${filename}`; // Set the desired filename
              a.style.display = 'none';
              
              document.body.appendChild(a);
              a.click();
              
          
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
       } else {
        console.log(response);
        // alert(response.data.message)
        //  console.error('Request failed with status:', response.status);
       }
        }
      } catch (error) {


        console.error('Error downloading Excel file:', error);
      }
    }
    else{
      alert("fill the field !!!!!!!!")
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
          <TextField
      select
      required={true}
      label="Select Document"
      value={data.document}
      onChange={handleChangeDownload}
      fullWidth
      margin="normal"
    >
      <MenuItem value="generate-excel">Eligibility</MenuItem>
      <MenuItem value="generate-pdf-withoutKt">WithOutKt</MenuItem>
      <MenuItem value="generate-pdf-withKt">WithKt</MenuItem>
     
    </TextField>
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