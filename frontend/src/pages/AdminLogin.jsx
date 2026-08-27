import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/style.css'

function AdminLogin() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ admin_email: "", admin_pass: "" })

    const txtBxHandler = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/adminlogin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        const result = await response.json()

        if (response.status != 200) {
            alert(result.message)
        } else {
            localStorage.setItem("token", result.token)
            localStorage.setItem("role", result.role)
            navigate('/admin/dashboard')
        }
    }

    return (
        <div className="page-bg">
            <div className="custom-wrapper">
                <div className="custom-card">
                    <h3 className="card-title">Admin Login</h3>
                    <div className="mb-3">
                        <label className="form-label">Admin Email</label>
                        <input className="form-control" type="email" name="admin_email" value={formData.admin_email} onChange={txtBxHandler} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input className="form-control" type="password" name="admin_pass" value={formData.admin_pass} onChange={txtBxHandler} />
                    </div>
                    <button type="submit" onClick={submitHandler} className="btn-brand w-100">Login</button>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin