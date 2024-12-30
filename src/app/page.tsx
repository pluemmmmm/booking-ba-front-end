import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//import Components
import Calendar from './home/page'
import Login from './login/page'
import Navbar from "./components/navbar";


const App = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default App
