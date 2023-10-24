import React, {  useEffect, useRef, useState } from 'react';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import Appbar from '../components/Appbar';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import StudentTable from './studenttable';
import {studentByAcdmicYear} from "../api/api"


export default function SelectBatch() {
      
  const [open, setOpen] = React.useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [students,setStudent]=useState([]);

  const semFinaluseRef=useRef(null)
  
  
  
  const [data, setData] = useState({
    Departname: '',
    End_Year: null,
    startYear:null,
    index:1
  });

  const semRef=useRef(data);


 

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

      
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
      Start_Year: formattedDate, // Update Start_YearMonth with the formatted date
      End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && data.Departname && data.startYear) {
      handleBatchSubmit();
    }
  };
  const handlesemIndex = async(index) => {
    semRef.current=data
    semRef.current.index=index;
    setData({...semRef.current});
    try {
      const x= await studentByAcdmicYear(semRef.current)
      // console.log(x.data);
      if(x.data.status=="ok"){
        setStudent(x.data.data.data)
        semFinaluseRef.current=x.data.data.final_Revaluation
      }
    } catch (error) {
      
    }
  };
  

  const handleBatchSubmit = async() => {
    const x= await studentByAcdmicYear(data)
    //  console.log(data);
    if(x.data.status=="ok"){
      setSubmitted(true);
      semFinaluseRef.current=x.data.data.final_Revaluation
      setStudent(x.data.data.data)   
    }
    else{
      alert(x.data.data)
    }
  };




  return (
    
    <Grid container justifyContent="center" spacing={2} sx={{ overflow:"hidden" }}>
  
      {submitted ? ( 
        <Box sx={{ display: 'flex'}}>

          <Appbar pageName='Edit batch' open={open} handleDrawerOpen={handleDrawerOpen} />
          <Navbar open={open} handleDrawerClose={handleDrawerClose} />
          <Box component="main" sx={{ flexGrow: 1, p: 15, width:"80vw"}}>
          
        
          <StudentTable Final_Revaluation={semFinaluseRef.current} refresh={handleBatchSubmit}   allStudent={students} data={data} onChange={handlesemIndex}></StudentTable>
   
      
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