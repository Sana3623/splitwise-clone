import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/style.css'

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    let navigate = useNavigate()

    const handleChangePassword = async () => {

        let token = localStorage.getItem("token")

        let response = await fetch('http://localhost:5000/changepassword', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })

        let data = await response.json()

        if (!response.ok) {
            alert(data.message)
        } else {
            alert(data.message)
            setOldPassword('')
            setNewPassword('')
            navigate('/userprofile')
        }
    }

    return (
        <>
            <div className="page-bg">
                <div className="custom-wrapper">
                    <div className="custom-card">
                        <h2 className="card-title">Change Password</h2>

                        <div>
                            <label className="form-label">Old Password</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" />
                        </div>
                        <div>
                            <label className="form-label">New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" />
                        </div>
                        <button type='submit' onClick={handleChangePassword} className="btn btn-brand w-100 btn-outline-green">Change Password</button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword