import React, { useState, useEffect } from 'react'

function ExpenseList({ grpId }) {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchExpenses = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(`http://localhost:5000/groups/${grpId}/expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!response.ok) {
                setExpenses([])
                return
            }
            const result = await response.json()
            setExpenses(result)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [grpId])

    if (loading) {
        return <p className="text-center-muted">Loading expenses...</p>
    }

    return (
        <div className="custom-card">
            <p className="card-title">Expenses</p>
            {expenses.length === 0 ? (
                <p className="text-center-muted">No expenses added yet.</p>
            ) : (
                expenses.map((exp) => (
                    <div key={exp.exp_id} className="balance-row">
                        <div>
                            <p className="card-title-left">{exp.descri}</p>
                            <p className="card-subtitle">Paid by {exp.paid_by}</p>
                        </div>
                        <p className="balance-positive">₹{exp.amount}</p>
                    </div>
                ))
            )}
        </div>
    )
}

export default ExpenseList