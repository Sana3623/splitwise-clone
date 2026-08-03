import React, { useState } from 'react'

function Signup() {
    let [formData, setFormData] = useState({user_name: "", user_email: "",user_password:""})

    let txtBxHandler = (e) => {
        let { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    let submitHandler = async (e) => {
        e.preventDefault()

        let response = await fetch('http://localhost:5000/signup', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        let result = await response.json()
        console.log(result)

        setFormData({ user_name: "", user_email: "",user_password:"" })
    }

    return (
        <>
           
                <div>
                    <label>User Name:</label>
                    <input value={formData.username} type="text" name="user_name" onChange={txtBxHandler} />
                </div>
                <div>
                    <label>Email</label>
                    <input value={formData.email} type="email" name="user_email" onChange={txtBxHandler} />
                </div>
                 <div>
                    <label>Password</label>
                    <input value={formData.password} type="password" name="user_password" onChange={txtBxHandler} />
                </div>
                <div>
                    <button type='submit'onClick={submitHandler}>Submit</button>
                </div>
           
        </>
    )
}

export default Signup