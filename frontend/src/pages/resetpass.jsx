import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { useState  } from "react";
import {resetPassword} from "../api/api"
import {  useParams } from 'react-router-dom';
const defaultTheme = createTheme();

export default function ForgotPass() {
    let { userId, resetString} = useParams();
    const [data, setData] = useState({
      userId: userId,
      resetString:resetString,
      newPassword:"",
      cpassword:""
      
    });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if(data.cpassword===data.newPassword&&data.newPassword!==""){
        // setData({...data,[userId]:userId,[resetString]:resetString})
        console.log(data);
        const x= await resetPassword(data)
        alert(x.data.data);
        window.location.href="/login";
    }
    else{
        alert("Password is not match");
    }
 
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            
          }}
        >
         
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Reset Password
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Type in new Password
          </Typography>
          <Box component="form" >
            <Paper sx={{ p: 2 }}> {/* Add spacing to the paper */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
              label="Enter Password"
              name="password"
              onChange={handleChange}
                autoFocus
              />
              <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              onChange={handleChange}
              label="Confirm Password"
              name="cpassword"
              
              autoFocus
            />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}