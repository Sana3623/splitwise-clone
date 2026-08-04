import React from 'react'
import { Link } from 'react-router-dom'
import  '../css/style.css'
import logo from '../assets/spliteaselogo.svg'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-brand-custom">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="logo" className="nav-logo" />
                    <span className="brand-name">SplitEase</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                         <li className="nav-item">
                            <Link className="nav-link" to="/groups">Groups</Link>
                        </li>
                         <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/signup">Sign Up</Link>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>

  )
}

export default Navbar