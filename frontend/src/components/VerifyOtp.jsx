import React,{useState} from 'react'
import '../css/style.css'

function Verify_otp({userEmail}) {
     let [txtBxVal, setTxtBxVal] = useState("")

  let txtHandler = (e) => {
       
        setTxtBxVal (e.target.value)
    }

let verifyHandler = async (e) => {
        e.preventDefault()

        let response = await fetch('http://localhost:5000/verifyotp', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userOtp:txtBxVal,userEmail:userEmail })
        })
        let result = await response.json()
        console.log(result)
       
    }

    return (
        <div className="page-bg">
            <div className="custom-wrapper">
                <div className="custom-card">
                <h3 className="otp-title">Enter OTP</h3>
                <form onSubmit={verifyHandler}>
                    <div className="mb-3">
                        <input type="text" value={txtBxVal} onChange={txtHandler} className="form-control" placeholder="Enter 6-digit OTP"  />
                    </div>
                    <button type="submit" className="btn btn-brand w-100"> Verify </button>
                </form>
            </div>
            </div>
        </div>
    )
}

export default Verify_otp