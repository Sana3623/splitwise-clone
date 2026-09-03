import React from 'react'

function GroupCard({ group, onClick, onDelete }) {
    const handleDelete = (e) => {
        e.stopPropagation()
        if (window.confirm(`Delete "${group.grp_name}"? This removes all its expenses too.`)) {
            onDelete(group.grp_id)
        }
    }

    return (
        <div className="custom-card cursor-pointer" onClick={onClick}>
            <div className="group-card-header">
                <p className="card-title card-title-left">{group.grp_name}</p>
                <button className="delete-btn" onClick={handleDelete}>×</button>
            </div>
            <p className="card-subtitle">Tap to view expenses</p>
        </div>
    )
}

export default GroupCard