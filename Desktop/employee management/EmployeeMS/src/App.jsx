import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'


import Dashboard from './components/Dashboard'
import Employee from './components/Employee'
import Category from './components/Category'
import Profile from './components/Profile'
import AddCategory from './components/AddCategory'
import TempHome from './components/TempHome'
import AddEmployee from './components/AddEmployee'
import EditEmployee from './components/EditEmployee'
import Start from './components/Start'
import EmployeeLogin from './components/EmployeeLogin'
import EmployeeDetail from './components/EmployeeDetail'
import axios from 'axios'
import PrivateRoute from './components/PrivateRoute'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start/>}> </Route>

        <Route path='/employee_login' element={<EmployeeLogin/>}></Route>
        <Route path='/employee_detail/:id' element={<PrivateRoute><EmployeeDetail/></PrivateRoute>}></Route>

        <Route path='/adminlogin' element={<Login/>}></Route>

        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}> 
          <Route path='' element={<TempHome/>}> </Route>
          <Route path='/dashboard/employee' element={<Employee/>}> </Route>
          <Route path='/dashboard/category' element={<Category/>}> </Route>
          <Route path='/dashboard/profile' element={<Profile/>}> </Route>
          <Route path='/dashboard/add_category' element={<AddCategory/>}> </Route>
          <Route path='/dashboard/add_employee' element={<AddEmployee/>}> </Route>
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee/>}> </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
