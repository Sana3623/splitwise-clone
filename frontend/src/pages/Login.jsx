import React, { useState } from 'react'

function Login() {
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
    }

    return (
        <form onSubmit={submitHandler}>
            <div>
                <label>Email</label>
                <input value={formData.email} type="email" name="user_email" onChange={txtBxHandler} />
            </div>
            <div>
                <label>Password</label>
                <input value={formData.password} type="password" name="user_password" onChange={txtBxHandler} />
            </div>
            <div>
                <button type='submit'>Submit</button>
            </div>
        </form>
    )
}

export default Login