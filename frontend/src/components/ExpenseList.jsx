import React, { useState, useEffect } from 'react'

function ExpenseList({ grpId, onExpenseDeleted }) {
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

    const deleteExpense = async (expId) => {
        if (!window.confirm("Delete this expense?")) return

        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5000/expenses/${expId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()

        if (!response.ok) {
            alert(result.message)
            return
        }

        fetchExpenses()
        if (onExpenseDeleted) onExpenseDeleted()
    }

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
                            <p className="expense-date">{new Date(exp.created_at).toLocaleString()}</p>
                        </div>
                        <div className="expense-right">
                            <p className="balance-positive">₹{exp.amount}</p>
                            <button className="delete-btn" onClick={() => deleteExpense(exp.exp_id)}>×</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default ExpenseList