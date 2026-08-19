import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList'
import '../css/style.css'

function GroupDetails() {
    const { grpId } = useParams();
    const navigate = useNavigate();
    const [groupInfo, setGroupInfo] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGroupDetails = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5000/groups/${grpId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                navigate('/groups');
                return;
            }

            const result = await response.json();
            setGroupInfo(result.group);
            setMembers(result.members);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [grpId]);

    if (loading) {
        return null;
    }

    return (
        <div className="page-bg">
            <div className="custom-wrapper wrapper-column">
                <button className="btn-outline-green back-btn" onClick={() => navigate('/groups')}>
                    ← Back to groups
                </button>

                <div className="custom-card">
                    <p className="card-title">{groupInfo.grp_name}</p>
                    <p className="card-subtitle">
                        {members.length} member{members.length !== 1 ? 's' : ''}: {members.map(m => m.user_name).join(', ')}
                    </p>
                </div>

                {/* AddExpenseForm and BalanceSummary will go here once built */}

                <ExpenseList grpId={grpId} />
            </div>
        </div>
    )
}

export default GroupDetails