import React, { useState, useEffect } from 'react'

function BalanceSummary({ grpId, members }) {
    const [balances, setBalances] = useState([]);
    const [settleTarget, setSettleTarget] = useState(null);
    const [settleAmount, setSettleAmount] = useState('');
    const currentUserId = localStorage.getItem("userId");

    const fetchBalances = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/groups/${grpId}/balances`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        setBalances(result);
    };

    useEffect(() => {
        fetchBalances();
    }, [grpId]);
    
const submitSettle = async (paidTo) => {
    const token = localStorage.getItem("token")
    const response = await fetch("http://localhost:5000/settle", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ grp_id: grpId, paid_to: paidTo, amount: parseFloat(settleAmount) })
    })
    const result = await response.json()

    if (!response.ok) {
        alert(result.message)
        return
    }

    setSettleTarget(null)
    setSettleAmount('')
    fetchBalances()
}

    return (
        <div className="custom-card">
            <p className="card-title">Balances</p>
            {balances.map((b) => (
                <div key={b.user_id} className="balance-row">
                    <span>{b.user_id == currentUserId ? "You" : b.user_name}</span>

                    {b.net_balance > 0 && <span className="balance-positive">gets back ₹{Number(b.net_balance).toFixed(2)}</span>}
                    {b.net_balance < 0 && <span className="balance-negative">owes ₹{Math.abs(Number(b.net_balance)).toFixed(2)}</span>}
                    {b.net_balance == 0 && <span className="text-center-muted">settled up</span>}

                    {b.net_balance < 0 && b.user_id == currentUserId && settleTarget === null && (
                        <button className="btn-outline-green settle-btn" onClick={() => setSettleTarget('open')}>Settle up</button>
                    )}
                </div>
            ))}

            {settleTarget === 'open' && (
                <div className="settle-form">
                    <label className="form-label">Settle with</label>
                    <select className="form-control" id="settleWith">
                        {members.filter(m => m.user_id != currentUserId).map(m => (
                            <option key={m.user_id} value={m.user_id}>{m.user_name}</option>
                        ))}
                    </select>
                    <label className="form-label mt-8">Amount</label>
                    <input className="form-control" type="number" value={settleAmount} onChange={(e) => setSettleAmount(e.target.value)} />
                    <div className="btn-row mt-8">
                        <button className="btn-outline-green btn-flex" onClick={() => setSettleTarget(null)}>Cancel</button>
                        <button
                            className="btn-brand btn-flex"
                            onClick={() => submitSettle(document.getElementById('settleWith').value)}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BalanceSummary