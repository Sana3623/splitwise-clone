import React, { useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import '../css/style.css'

function CreateGroup() {
    const navigate = useNavigate()
    const location = useLocation()
    const { userId } = location.state || {}

    const [groupName, setGroupName] = useState('')
    const [memberInput, setMemberInput] = useState('')
    const [members, setMembers] = useState([])

    const addMember = () => {
        if (memberInput.trim()) {
            setMembers([...members, memberInput.trim()])
            setMemberInput('')
        }
    }
  
    const removeMember = (name) => {
        setMembers(members.filter(m => m !== name))
    }

    const submitHandler = async () => {
   

        const response = await fetch("http://localhost:5000/creategrp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grp_name: groupName, members: members, user_id: userId })
        })
        const result = await response.json()
        console.log(result)

        navigate('/groups')
    }

    return (
        <div className="page-bg">
            <div className="custom-wrapper">
                <div className="custom-card">
                <h3 className="card-title">Create a group</h3>

                <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input
                        className="form-control"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Add Members</label>
                    <input
                        className="form-control"
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                    />
                    <button type="button" onClick={addMember} className="btn-outline-green" style={{ marginTop: '8px' }}>Add</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {members.map((m) => (
                        <span key={m} className="bg-light-green text-green" style={{ padding: '6px 10px', borderRadius: '20px', fontSize: '13px' }}>
                            {m} <button type="button" onClick={() => removeMember(m)} style={{ background: 'none', border: 'none', color: 'inherit' }}>×</button>
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => navigate('/groups')} className="btn-outline-green" style={{ flex: 1 }}>Cancel</button>
                    <button type="button" onClick={submitHandler} className="btn-brand" style={{ flex: 1 }}>Create group</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default CreateGroup

