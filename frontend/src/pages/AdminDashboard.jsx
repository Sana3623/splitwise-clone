import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/style.css'

function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)

    const fetchStats = async () => {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/admin/stats", {
            headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
            navigate('/adminlogin')
            return
        }
        const result = await response.json()
        setStats(result)
    }

    useEffect(() => {
        const role = localStorage.getItem("role")
        if (role !== 'admin') {
            navigate('/adminlogin')
            return
        }
        fetchStats()
    }, [])

    if (!stats) return null

    return (
        <div className="page-bg">
            <div className="custom-wrapper wrapper-column">
                <h1 className="text-green text-center-heading">Admin Dashboard</h1>
                <div className="summary-grid stats-grid-4">
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">Total Users</p>
                        <p className="text-green stat-number">{stats.total_users}</p>
                    </div>
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">Total Groups</p>
                        <p className="text-green stat-number">{stats.total_groups}</p>
                    </div>
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">Total Expenses</p>
                        <p className="text-green stat-number">{stats.total_expenses}</p>
                    </div>
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">Total Amount</p>
                        <p className="text-green stat-number">₹{stats.total_amount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard