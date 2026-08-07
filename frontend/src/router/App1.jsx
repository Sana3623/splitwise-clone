import React,{ useState } from 'react'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
// import CreateGroupModal from '../components/CreateGroupModal'
import GroupPage from '../pages/GroupPage'
// import Dashboard from '../pages/Dashboard'

function App() {
  
  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/grppage" element={<GroupPage />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
}

export default App;
