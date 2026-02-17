import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Otp from './page/Authentication/Otp';
import Registration from './page/Authentication/Registration';
import Login from './page/Authentication/Login';
import Home from './page/Home';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/registration' element= {<Registration></Registration>}></Route>
        <Route path='/otp' element={<Otp></Otp>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App