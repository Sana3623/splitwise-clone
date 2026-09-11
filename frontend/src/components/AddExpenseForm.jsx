import React, { useState } from "react"

function AddExpenseForm({ grpId, members, onExpenseAdded }) {
    const currentUserId = localStorage.getItem("userId")

    const [descri, setDescri] = useState('')
    const [amount, setAmount] = useState('')
    const [paidBy, setPaidBy] = useState(currentUserId || '')
    const [splitAmong, setSplitAmong] = useState(members.map(m => m.user_id))

    const toggleMember = (userId) => {
        if (splitAmong.includes(userId)) {
            setSplitAmong(splitAmong.filter(id => id !== userId))
        } else {
            setSplitAmong([...splitAmong, userId])
        }
    }

   const submitHandler = async () => {
   

    const trimmedDescri = descri.trim()
    const numericAmount = parseFloat(amount)

    if (!trimmedDescri) {
        alert("Please enter a description")
        return
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
        alert("Please enter a valid amount greater than 0")
        return
    }
    if (!paidBy) {
        alert("Please select who paid")
        return
    }
    if (splitAmong.length === 0) {
        alert("Select at least one member to split with")
        return
    }

    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:5000/addexpense", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            grp_id: grpId,
            paid_by: paidBy,
            descri: trimmedDescri,
            amount: numericAmount,
            split_among: splitAmong
        })
    })
    const result = await response.json()

    if (!response.ok) {
        alert(result.message || "Failed to add expense")
        return
    }

    setDescri('')
    setAmount('')
    onExpenseAdded()
}
    return (
        <div className="custom-card">
            <p className="card-title">Add expense</p>

            <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                    className="form-control"
                    value={descri}
                    onChange={(e) => setDescri(e.target.value)}
                    placeholder="e.g. Dinner, cab fare"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                    className="form-control"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Paid by</label>
                <select className="form-control" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                    {members.map(m => (
                        <option key={m.user_id} value={m.user_id}>
                            {m.user_id == currentUserId ? "You" : m.user_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Split among</label>
                {members.map(m => (
                    <div key={m.user_id} className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={splitAmong.includes(m.user_id)}
                            onChange={() => toggleMember(m.user_id)}
                        />
                        <span>{m.user_id == currentUserId ? "You" : m.user_name}</span>
                    </div>
                ))}
            </div>

            <button className="btn-brand w-100" onClick={submitHandler}>Add expense</button>
        </div>
    )
}

export default AddExpenseForm