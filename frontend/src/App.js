import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Home from './pages/dashboard';
import Editbatch from './pages/editbatch';
import Addbatch from './pages/addbatch';
import Findyear from './pages/findyear';
import Uploaddata from './pages/uploaddata';
import Addsem from './pages/addsem';
import StudentTable from './pages/studenttable';

export default function App() {
  return (
    <>
      <Router>
        <Routes >
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/addbatch" exact element={<Addbatch />}></Route>
          <Route path="/editbatch" exact element={<Editbatch />}></Route>
          <Route path="/studenttable" exact element={<StudentTable />}></Route>
          <Route path="/addsem" exact element={<Addsem />}></Route>
          <Route path="/uploaddata" exact element={<Uploaddata />}></Route>
          <Route path="/findyear" exact element={<Findyear />}></Route>
        </Routes>
      </Router>
    </>
  )
}


