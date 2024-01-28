import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Appbar from '../components/Appbar';
import DepartmentSelect from '../components/Selectdepartment';
import MonthYearSelect from '../components/Selectmonthyear';
import { Grid, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, MenuItem, TextField,Select, Typography, InputLabel, Paper } from '@mui/material';
import {addStudentIndividul} from "../api/api"

const GenderItems = [
  { id: 'M', title: 'Male' },
  { id: 'F', title: 'Female' },
  { id: 'O', title: 'Other' },
]


export default function Uploaddata() {
  const [open, setOpen] = React.useState(false);
  const [PreviousYearShow, setPreviousYearShow] = React.useState(false);
  const [tfws_j_show, set_tfws_j_show] = React.useState(false);
  const [student, setStudent] = React.useState(
    {Roll_No:0
      ,Name: ''
      ,Gender: null}
  );
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
  students:[],
  No_of_j_k:0,
  No_of_tfws:0,
  Previous_Departname:"",
  typeOfStudent:"",
  Previous_Roll_No:0
});
const myref=useRef(data)

const handleDateChange = (date) => {
  const selectedYear = dayjs(date).format('MMMM YYYY');
  if(data.typeOfStudent===""){
    alert("Select type of Studebt")
  }
  else if(data.typeOfStudent==="normal"){
    setData((prevData) => ({
      ...prevData,
      Start_Year: selectedYear,
      End_Year: dayjs(date).add(4, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
    }));
  }
  else{
    setData((prevData) => ({
      ...prevData,
      Start_Year: selectedYear,
      End_Year: dayjs(date).add(3, 'year').format('MMMM YYYY'), // Calculate and format End_YearMonth
    }));
  }

};

const HandleChange = (event) => {
  console.log(event.target.value);
  setData((prevData) => ({
    ...prevData,
    [event.target.name]:  event.target.value,
  }));
  
  if(event.target.value==="branchChange"){
    setPreviousYearShow(true)
    set_tfws_j_show(false);
  }
  else if(event.target.value==="normal"){
    console.log("jbsfjfhughe");
    setPreviousYearShow(false)
    set_tfws_j_show(true);
  }
  else if(event.target.value==="dse"){
    set_tfws_j_show(false);
    setPreviousYearShow(false)
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && data.Departname && data.Start_Year) {
    handleSubmit();
  }
};

const handleSubmit = async() => {
  if (!data.Departname) {
    console.log("Please enter the department.");
  } else if (!data.typeOfStudent) {
    console.log("Please enter the Type of student");
  } else {
    myref.current=data
    const info=[student]
    myref.current.students=info
    setData((prevData) => ({
      ...prevData,
      students:info,
    }));
  
    const x= await addStudentIndividul(data);
   alert(x.data.data);
  }


};
const HandlePreviousYear = (e) => {

    setData((prevData) => ({
      ...prevData,
      Previous_Departname  : e.target.value,
    }));
  
};
const HandleChangeStudent = (e) => {

    setStudent((prevData) => ({
      ...prevData,
      [e.target.name]:  e.target.value,
    }));
  
};
const handleDepartmentChange = (e) => {
  if (!data.typeOfStudent) {
    console.log("Please enter the type of student.");
  }else{
    setData((prevData) => ({
      ...prevData,
      Departname  : e.target.value,
    }));
  }
};






  return (
<Grid container justifyContent="center" spacing={2}>
  <Box sx={{ display: 'flex' }}>
    <Appbar pageName='Upload Data' open={open} handleDrawerOpen={handleDrawerOpen} />
    <Navbar open={open} handleDrawerClose={handleDrawerClose} />
    <Box component="main" sx={{ flexGrow: 1, p: 15 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Enter Student Details
      </Typography>

      <Paper elevation={3} sx={{ flexGrow: 1, p: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              required={true}
              name='typeOfStudent'
              label="Select Type of student"
              value={data.typeOfStudent}
              onChange={HandleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="dse">DSE</MenuItem>
              <MenuItem value="branchChange">Branch Change</MenuItem>
            </TextField>
          </Grid>

          {tfws_j_show ? (
            <>
              <Grid item xs={12}>
                <TextField
                  name="No_of_tfws"
                  label="No of tfws"
                  value={data.No_of_tfws}
                  onChange={HandleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="No_of_j_k"
                  label="No of J&k"
                  value={data.No_of_j_k}
                  onChange={HandleChange}
                  fullWidth
                />
              </Grid>
            </>
          ) : null}

          {PreviousYearShow ? (
            <>
              <Grid item xs={12}>
                <label htmlFor="">Previous Departname</label>
                <DepartmentSelect value={data.Previous_Departname} onChange={HandlePreviousYear} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="Previous_Roll_No"
                  label="Previous RollNo"
                  value={data.Previous_Roll_No}
                  onChange={HandleChange}
                  fullWidth
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12}>
            <TextField
              name="Roll_No"
              label="Roll No"
              value={data.Roll_No}
              onChange={HandleChangeStudent}
              fullWidth
            />
          </Grid>

          {!PreviousYearShow ? (
            <>
              <Grid item xs={12}>
                <TextField
                  name="Name"
                  label="Full Name"
                  value={data.Name}
                  onChange={HandleChangeStudent}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    name="Gender"
                    value={data.Gender}
                    onChange={HandleChangeStudent}
                  >
                    {GenderItems.map((item) => (
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
            </>
          ) : null}

          <Grid item xs={12}>
            <DepartmentSelect value={data.Departname} onChange={handleDepartmentChange} />
          </Grid>
          <Grid item xs={12}>
            <MonthYearSelect value={data.Start_Year} onChange={handleDateChange} onKeyDown={handleKeyDown} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onKeyDown={handleKeyDown} onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>

      </Paper>

    </Box>
  </Box>
</Grid>

  )
}


