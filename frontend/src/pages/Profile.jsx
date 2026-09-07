import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/style.css'
import ChangePassword from './ChangePassword'

function Profile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)

    const fetchProfile = async () => {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/userprofile", {
            headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()
        setProfile(result)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
        navigate('/login')
    }

    if (!profile) return null

    return (
        <div className="page-bg">
            <div className="custom-wrapper wrapper-column">
                <div className="custom-card">
                    <p className="card-title">Account Details</p>

                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input value={profile.user_name} className="form-control" disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input value={profile.user_email} className="form-control" disabled />
                    </div>
                </div>

                <div className="custom-card"> <p>Security</p>
                    <p className="card-title-left cursor-pointer" onClick={() => navigate('/changepassword')}>changepassword</p>
                    <p className="card-title-left cursor-pointer" onClick={() => navigate('/logout')}>Sign Out</p>
                </div>
            </div>
        </div>
    )
}

export default Profile