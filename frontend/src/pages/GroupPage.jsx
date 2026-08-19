import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GroupList from '../components/GroupList'
import '../css/style.css'

function GroupPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [authChecked, setAuthChecked] = useState(false);
    const [loading, setLoading] = useState(true);

    const getUserGroups = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/groups", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                navigate('/login');
                return;
            }

            const result = await response.json();
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
        }
        setAuthChecked(true);
        getUserGroups();
    }, []);

    if (!authChecked || loading) {
        return null;
    }

    return (
        <div className="page-bg">
            <div className="custom-wrapper wrapper-column">
                <h1 className="text-green text-center-heading">Your groups</h1>

                <GroupList
                    groups={groups}
                    onGroupClick={(grpId) => navigate(`/groups/${grpId}`)}
                />

                <button
                    className="btn-brand w-100 mt-16"
                    onClick={() => navigate('/groups/new')}
                >
                    + Create group
                </button>
            </div>
        </div>
    )
}

export default GroupPage