import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import logo from '../assets/spliteaselogo.svg'
import '../css/style.css'

function GroupPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserDetails = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/grppage", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                navigate('/login');
                return;
            }

            const result = await response.json();
            console.log(result);
            setGroups(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="custom-wrapper">
            <h1 className="text-green">Your groups</h1>
            {groups.length === 0 ? (
                <p className="text-center-muted">No groups yet. Create one to get started.</p>
            ) : (
                <div>
                    {groups.map((grp) => (
                        <div key={grp.grp_id} className="custom-card">
                            <p className="card-title">{grp.grp_name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GroupPage;