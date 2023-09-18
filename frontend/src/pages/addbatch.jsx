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
    startYear: null,
    endYear: null,
    department: '',
    file: null
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

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const handleBatchSubmit = () => {
    if (!data.department) {
      console.log("Please enter the department.");
    } else if (!data.startYear) {
      console.log("Please enter the month and year");
    } else {
      console.log(data);
      setOpenUploadDialog(true);
    }
  };

  const handleUpload = () => {
    console.log(data);
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
          <DepartmentSelect value={data.department} onChange={handleDepartmentChange} />
        </Grid>
        <Grid container spacing={2} justifyContent="center"></Grid>
        <Grid item xs={5}>
          <MonthYearSelect value={data.startYear} onChange={handleDateChange} onKeyDown={handleKeyDown} />
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
            <VisuallyHiddenInput type="file" accept=".xlsm,.csv,.xlsx" onChange={handleFileChange} />
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