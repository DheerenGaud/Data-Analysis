import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/dashboard';
import Editbatch from './pages/editbatch';
import Addbatch from './pages/addbatch';
import Findyear from './pages/findyear';
import Uploaddata from './pages/uploaddata';
import Login from './pages/login';
import SignUp from './pages/signUp';
import Addsem from './pages/addsem';
import StudentTable from './pages/studenttable';
import DownloadData from './pages/downloaddata';
import Verifyed from "./pages/verify"
import ResetPassword from "./pages/resetpass"
import Forgot from "./pages/forgot"

export default function App() {
  
  const loginStatus = window.localStorage.getItem('loginStatus');
 
  return (
    <>
      <Router>
        <Routes >
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/signup" exact element={<SignUp />}></Route>
          <Route path="/forgot" exact element={<Forgot />}></Route>
          <Route path="/" exact element={loginStatus==="true"?<Home />:<Login />}></Route>
          <Route path="/addbatch" exact element={loginStatus==="true"?<Addbatch />:<Login />}></Route>
          <Route path="/editbatch" exact element={loginStatus==="true"?<Editbatch />:<Login />}></Route>
          <Route path="/downloaddata" exact element={loginStatus==="true"?<DownloadData />:<Login />}></Route>
          <Route path="/studenttable" exact element={loginStatus==="true"?<StudentTable />:<Login />}></Route>
          <Route path="/addsem" exact element={loginStatus==="true"?<Addsem />:<Login />}></Route>
          <Route path="/uploaddata" exact element={loginStatus==="true"?<Uploaddata />:<Login />}></Route>
          <Route path="/findyear" exact element={loginStatus==="true"?<Findyear />:<Login />}></Route>
          <Route path="/auth/verify/:userId/:uniqueString/" element={<Verifyed />}/>
          <Route path="/auth/resetPassword/:userId/:resetString"element={<ResetPassword/>}/>;
        </Routes>
      </Router>
    </>
  )
}


