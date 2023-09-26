import React, { useState } from 'react';
import dayjs from 'dayjs';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import Appbar from '../components/Appbar';

import {newAcdmicyear} from "../api/api"


const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function Addbatch() {
    
    const [open, setOpen] = React.useState(false);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
   
  const [data, setData] = useState({
    Start_Year: "",
    End_Year: "",
    Departname: '',
    file: null,
    No_of_student:5
  });


  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
    console.log(formattedDate);
    setData((prevData) => ({
      ...prevData,
      Start_Year: formattedDate, // Update Start_YearMonth with the formatted date
      End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
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
      Departname: newDepartment,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && data.Departname && data.Start_Year) {
      handleBatchSubmit();
    }
  };

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const handleBatchSubmit = () => {
    console.log(data);
    if (!data.Departname) {
      console.log("Please enter the department.");
    } else if (!data.Start_Year) {
      console.log("Please enter the month and year");
    } else {
      setOpenUploadDialog(true);
    }
  };

  const handleUpload = async () => {
   console.log(data);
   if(data.file!==null){
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('Departname', data.Departname);
      formData.append('Start_Year', data.Start_Year);
      formData.append('End_Year', data.End_Year);
      formData.append('No_of_student', data.No_of_student);

      const x=await newAcdmicyear(formData);
      if(x.data.status==="error"){
        alert(x.data.data);
      }
      else{
        alert(x.data.data);
      }
    
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle any errors that occur during the upload
    }
   }
   else{
    alert("select file plese!!!")
   }
  };

  return (
    <Box sx={{ display: 'flex' }}>
    <Appbar pageName='Add batch' open={open} handleDrawerOpen={handleDrawerOpen} />
    <Navbar open={open} handleDrawerClose={handleDrawerClose} />
    <Box component="main" sx={{ flexGrow: 1, p: 10}}>
        
      <Typography variant="h5" align="center" gutterBottom>
        Add New Batch
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={5}>
          <DepartmentSelect value={data.Departname} onChange={handleDepartmentChange} />
        </Grid>
        <Grid container spacing={2} justifyContent="center"></Grid>
        <Grid item xs={5}>
          <MonthYearSelect value={data.Start_Year} onChange={handleDateChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid container spacing={2} justifyContent="center"></Grid>
        <Grid item xs={5}>
          <Button variant="contained" color="primary" onKeyDown={handleKeyDown} onClick={handleBatchSubmit} fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Batch Data</DialogTitle>
        <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            href="#file-upload"
          >
            Select a file
            <VisuallyHiddenInput type="file" name='file' accept=".xlsm,.csv,.xlsx" onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
}