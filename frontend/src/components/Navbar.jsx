import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
   <nav className="navbar navbar-expand-lg">
  <div className="container">
    <a className="navbar-brand" href="/">SplitEase</a>
    <ul className="navbar-nav">
      <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
      <li className="nav-item"><Link className="nav-link" to="/groups">Groups</Link></li>
      <li className="nav-item"><button className="btn-logout btn btn-sm">Logout</button></li>
    </ul>
  </div>
</nav>
  )
}

export default Navbar