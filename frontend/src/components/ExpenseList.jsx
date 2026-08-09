import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/style.css'

function ExpenseList() {
    const { grpId } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`http://localhost:5000/groups/${grpId}/expenses`);
            const result = await response.json();
            setExpenses(result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [grpId]);

    if (loading) {
        return <p className="text-center-muted">Loading expenses...</p>
    }

    return (
        <div className="custom-wrapper" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <h3 className="card-title">Expenses</h3>

            {expenses.length === 0 ? (
                <p className="text-center-muted">No expenses added yet.</p>
            ) : (
                expenses.map((exp) => (
                    <div key={exp.exp_id} className="custom-card" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="card-title" style={{ marginBottom: '4px' }}>{exp.descri}</p>
                            <p className="card-subtitle">Paid by {exp.paid_by}</p>
                        </div>
                        <p className="balance-positive" style={{ fontSize: '16px' }}>₹{exp.amount}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default ExpenseList