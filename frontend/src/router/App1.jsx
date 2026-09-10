import React, { useState} from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import CreateGroup from '../components/CreateGroup'
import GroupDetails from '../components/GroupDetails'
import GroupPage from '../pages/GroupPage'
import Dashboard from '../pages/Dashboard'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import LogOut from '../pages/LogOut'
import Profile from '../pages/Profile'
import Verify_otp from '../pages/VerifyOtp'
import ChangePassword from '../pages/ChangePassword'


function App() {

   let location = useLocation()

    const [role, setRole] = useState(localStorage.getItem('role'))

    const updaterole = (role) => {
        setRole(role)
        if (role) {
            localStorage.setItem('role', role)
        } else {
            localStorage.removeItem('role')
        }
    }

  return (
    <>
      <Navbar role={role} />
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login updaterole={updaterole}/>} />
    <Route path="/signup" element={<Signup />} />
    <Route path='/verifyotp' element={<Verify_otp/>} />
    <Route path="/groups" element={<GroupPage />} />
    <Route path="/groups/new" element={<CreateGroup />} />
    <Route path="/groups/:grpId" element={<GroupDetails />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/adminlogin" element={<AdminLogin updaterole={updaterole}/>} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/logout" element={<LogOut updaterole={updaterole} />} />
    <Route path="/userprofile" element={<Profile />} />
    <Route path="/changepassword" element={<ChangePassword />} />

    
</Routes>
    </>
  );
}

export default App;
