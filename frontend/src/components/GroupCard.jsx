import React from 'react'

function GroupCard({ group, onClick }) {
    return (
        <div className="custom-card cursor-pointer" onClick={onClick}>
            <p className="card-title card-title-left">{group.grp_name}</p>
            <p className="card-subtitle">Tap to view expenses</p>
        </div>
    )
}

export default GroupCard