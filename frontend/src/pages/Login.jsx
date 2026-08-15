import React, { useState } from 'react'
import '../css/style.css'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/spliteaselogo.svg'

function Login() {

    let navigate = useNavigate()
    let [formData, setFormData] = useState({ user_email: "", user_password: "" })

    let txtBxHandler = (e) => {
        let { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    let submitHandler = async (e) => {
        e.preventDefault()

        let response = await fetch('http://localhost:5000/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        let result = await response.json()
        console.log(result)

        setFormData({ user_email: "", user_password: "" })
        if (response.status != 200) {
            alert(result.message)
        } else {
            localStorage.setItem("token", result)
            navigate('/grppage')

        }
    }

    return (
        <>
            <div className="page-bg">
                <div className="custom-wrapper">
                    <div className="custom-card">

                    
                            <img src={logo} alt="logo" className="glass-logo" />
                            <h3 className="card-title ">Login</h3>
                            <div className='mb-3'>
                                <label className='form-label'>Email</label>
                                <input value={formData.user_email} type="email" name="user_email" onChange={txtBxHandler} className='form-control' />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'> Password</label>
                                <input value={formData.user_password} type="password" name="user_password" onChange={txtBxHandler} className='form-control' />
                            </div>

                            <button type='submit' onClick={submitHandler} className="btn btn-brand w-100 btn-outline-green">Submit</button>
                        </div>
                    </div>
               
            </div>
        </>
    )
}

export default Login