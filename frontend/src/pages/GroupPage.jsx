import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import logo from '../assets/spliteaselogo.svg'
import '../css/style.css'
import CreateGroupModal from '../components/CreateGroupModal'

function GroupPage() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
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
      
            setLoading(false)
        
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigate('/login');
            return;
        } else {
            getUserDetails();
        }
    }, []);

    if (loading) {
        return <p className="text-center-muted">Loading your groups...</p>;
    }

    if (!authChecked || loading) {
        return null;
    }

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
                onClick={() => setShowModal(true)}
                style={{ marginTop: '16px' }}
            >
                + Create group
            </button>

            {showModal && (
                <CreateGroupModal
                    onClose={() => setShowModal(false)}
                    onCreate={() => {
                        setShowModal(false);
                        getUserGroups();   // refresh the list so the new group shows up
                    }}
                />
            )}
        </div>
    );
}

export default GroupPage;