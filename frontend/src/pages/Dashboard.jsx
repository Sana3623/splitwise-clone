import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/style.css'

function Dashboard() {
    const navigate = useNavigate();
    const [groupBalances, setGroupBalances] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/dashboard-summary", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                navigate('/login');
                return;
            }

            const result = await response.json();
            setGroupBalances(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
        fetchSummary();
    }, []);

    if (loading) {
        return null;
    }

    const totalOwedToYou = groupBalances
        .filter(g => g.net_balance > 0)
        .reduce((sum, g) => sum + Number(g.net_balance), 0);

    const totalYouOwe = groupBalances
        .filter(g => g.net_balance < 0)
        .reduce((sum, g) => sum + Math.abs(Number(g.net_balance)), 0);

   return (
    <div className="page-bg">
        <div className="custom-wrapper wrapper-column">
            <h1 className="text-green text-center-heading">Dashboard</h1>

            <div className="dashboard-layout">
                <div className="dashboard-left">
                    <p className="card-title-left">Your groups</p>
                    {groupBalances.length === 0 ? (
                        <p className="text-center-muted">No groups yet.</p>
                    ) : (
                        groupBalances.map((g) => (
                            <div
                                key={g.grp_id}
                                className="custom-card cursor-pointer balance-row"
                                onClick={() => navigate(`/groups/${g.grp_id}`)}
                            >
                                <span className="card-title-left">{g.grp_name}</span>
                                {g.net_balance > 0 && <span className="balance-positive">gets back ₹{Number(g.net_balance).toFixed(2)}</span>}
                                {g.net_balance < 0 && <span className="balance-negative">owes ₹{Math.abs(Number(g.net_balance)).toFixed(2)}</span>}
                                {g.net_balance == 0 && <span className="text-center-muted">settled up</span>}
                            </div>
                        ))
                    )}
                </div>

                <div className="dashboard-right">
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">You're owed</p>
                        <p className="balance-positive stat-number">₹{totalOwedToYou.toFixed(2)}</p>
                    </div>
                    <div className="custom-card stat-card">
                        <p className="card-subtitle">You owe</p>
                        <p className="balance-negative stat-number">₹{totalYouOwe.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default Dashboard