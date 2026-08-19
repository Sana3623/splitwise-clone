import React, { useState } from 'react'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import CreateGroup from '../components/CreateGroup'
import GroupDetails from '../components/GroupDetails'
import GroupPage from '../pages/GroupPage'


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:grpId" element={<GroupDetails />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
}

export default App;
