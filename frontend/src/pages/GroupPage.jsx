import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import logo from '../assets/spliteaselogo.svg'
import '../css/style.css'
import CreateGroup from '../components/CreateGroup'

function GroupPage() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])

    const [showModal, setShowModal] = useState(false)

    const getUserDetails = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/grppage", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem("token")
            navigate('/login')
            return;
        }

        const result = await response.json()
        console.log(result)
        setGroups(result)



    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigate('/login');
            return;
        } else {
            getUserDetails();
        }
    }, []);



    return (
        <div className="custom-wrapper" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <h1 className="text-green" style={{ textAlign: 'center' }}>Your groups</h1>

            {groups.length === 0 ? (
                <p className="text-center-muted">No groups yet. Create one to get started.</p>
            ) : (
                groups.map((grp) => (
                    <div
                        key={grp.grp_id}
                        className="custom-card"
                        onClick={() => navigate(`/groups/${grp.grp_id}`)}
                        style={{ cursor: 'pointer', textAlign: 'left' }}
                    >
                        <p className="card-title">{grp.grp_name}</p>
                    </div>
                ))
            )}

            <button
                className="btn-brand w-100"
                onClick={() => navigate('/groups/new', { state: { userId: user.user_id, userName: user.user_name } })}
                style={{ marginTop: '16px' }}
            >
                + Create group
            </button>

        </div>
    );
}

export default GroupPage;