import React from 'react'
import GroupCard from './GroupCard'

function GroupList({ groups, onGroupClick, onGroupDelete }) {
    if (groups.length === 0) {
        return <p className="text-center-muted">No groups yet. Create one to get started.</p>
    }

    return (
        <div className="group-grid">
            {groups.map((grp) => (
                <GroupCard
                    key={grp.grp_id}
                    group={grp}
                    onClick={() => onGroupClick(grp.grp_id)}
                    onDelete={onGroupDelete}
                />
            ))}
        </div>
    )
}

export default GroupList