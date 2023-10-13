import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react';
import { Paper } from '@mui/material';
import { forgetPassword } from '../api/api';

const defaultTheme = createTheme();

export default function SignIn() {
     
  const [data, setData] = useState({
    email: "",
    redirecrURL:"http://localhost:3000/auth/resetPassword"
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  
  const handleClick = async (e) => {
    e.preventDefault();

    const x= await forgetPassword(data)
    
    if(x.data.status==="Pending"){
      alert(x.data.data) 
      window.location.href="./login";
    }
    else{
      alert(x.data) 
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
              Forgot Password
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Lost your password? Please enter your email address. 
              You will receive a link to create a new password on email.
            </Typography>
            <Box component="form"  >
              <Paper sx={{ p: 2 }}> {/* Add spacing to the paper */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  onChange={handleChange}
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <Button
                  onClick={handleClick}
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