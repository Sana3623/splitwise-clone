import React, { useEffect } from "react";
import {useNavigate} from 'react-router-dom'

function LogOut({updaterole}){
const navigate = useNavigate()

useEffect(()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    updaterole(null)

    navigate('/')
},[navigate,updaterole])

    return(
        <>

        </>
    )
}

export default LogOut