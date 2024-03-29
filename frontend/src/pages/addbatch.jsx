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
import { TextField, MenuItem } from '@mui/material';
import {    Paper } from '@mui/material';
import {newAcdmicyear,newDseAcdmicyear} from "../api/api"


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
   
    const [PreviousYearShow, setPreviousYearShow] = React.useState(false);
    const [tfws_j_show, set_tfws_j_show] = React.useState(false);
  const [data, setData] = useState({
    Start_Year: "",
    End_Year: "",
    Departname: '',
    file: null,
    No_of_student:0,
    typeOfStudent:"",
    No_of_j_k:0,
    No_of_tfws:0,
  });


  const handleDateChange = (date) => {
    if(!data.typeOfStudent){
            alert("First select the type of student")
    }
    else{
      if(data.typeOfStudent!=="dse"){
        const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
        setData((prevData) => ({
          ...prevData,
          Start_Year: formattedDate, // Update Start_YearMonth with the formatted date
          End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
        }));
      }
      else{
        const formattedDate = dayjs(date).format('MMMM YYYY'); // Format the date as "Month Year"
        setData((prevData) => ({
          ...prevData,
          Start_Year: formattedDate, // Update Start_YearMonth with the formatted date
          End_Year: dayjs(date).add(3, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
        }));
      }
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setData((prevData) => ({
      ...prevData,
      file: file
    }));
  };
  const handleChangeTypeStudent = (e) => {  
    setData((prevData) => ({
      ...prevData,
      typeOfStudent: e.target.value
    }));
    if(e.target.value==="normal"){
      set_tfws_j_show(true);
    }
    else{
      set_tfws_j_show(false);
    }
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
    if (!data.Departname) {
      alert("Please enter the department.")
    } else if (!data.Start_Year) {
      alert("Please enter the month and year")
    } 
    else if(!data.typeOfStudent){
      alert("Please enter the type of student")
    }else {
      setOpenUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    console.log(data);
   if(data.file!==null){
     const formData = new FormData();
     formData.append('file', data.file);
     formData.append('Departname', data.Departname);
     formData.append('Start_Year', data.Start_Year);
     formData.append('End_Year', data.End_Year);
     formData.append('No_of_student', data.No_of_student);
     formData.append('No_of_j_k', data.No_of_j_k);
     formData.append('No_of_tfws', data.No_of_tfws);
    try {
      if(data.typeOfStudent!=="dse"){
            
        const x=await newAcdmicyear(formData);
        if(x.data.status==="error"){
          alert(x.data.data);
        }
        else{
          alert(x.data.data);
        }
      }
      else{
        const x=await newDseAcdmicyear(formData);
        if(x.data.status==="error"){
          alert(x.data.data);
        }
        else{
          alert(x.data.data);
        }
      }

    
    } catch (error) {
      console.error('Error uploading file:', error);
    }
   }
   else{
    alert("select file plese!!!")
   }
  };

  
const HandleChange = (event) => {
  console.log(event.target.value);
  setData((prevData) => ({
    ...prevData,
    [event.target.name]:  event.target.value,
  }));
  
};

  return (
    <>
  
  <Grid container justifyContent="center" spacing={2}>
  <Box sx={{ display: 'flex' }}>
    <Appbar pageName='Add Batch' open={open} handleDrawerOpen={handleDrawerOpen} />
    <Navbar open={open} handleDrawerClose={handleDrawerClose} />
    <Box component="main" sx={{ flexGrow: 1, p: 15 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Select Batch
      </Typography>
      <Box width="50vw" sx={{ display: 'flex' }}>
        <Paper elevation={3} sx={{ flexGrow: 1, p: 6 }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                select
                required={true}
                label="Select Type of student"
                value={data.typeOfStudent}
                onChange={handleChangeTypeStudent}
                fullWidth
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="dse">DSE</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <DepartmentSelect value={data.Departname} onChange={handleDepartmentChange} />
            </Grid>
            <Grid item xs={12} md={6} className='pageStyle'>
              <MonthYearSelect value={data.Start_Year} onChange={handleDateChange} onKeyDown={handleKeyDown} />
            </Grid>
            {
              tfws_j_show ?
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="No_of_tfws"
                      label="No of TFWS"
                      value={data.No_of_tfws}
                      onChange={HandleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="No_of_j_k"
                      label="No of J&K"
                      value={data.No_of_j_k}
                      onChange={HandleChange}
                      fullWidth
                    />
                  </Grid>
                </> :
                <></>
            }
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button variant="contained" color="primary" onKeyDown={handleKeyDown} onClick={handleBatchSubmit} fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
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
  </Box>
</Grid>

</>
  );
}