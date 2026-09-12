import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import '../css/style.css'

function CreateGroup() {
    const navigate = useNavigate()
    const currentUserId = localStorage.getItem("userId")

    const [groupName, setGroupName] = useState('')
    const [memberInput, setMemberInput] = useState('')
    const [members, setMembers] = useState([])

 const addMember = () => {
    const trimmed = memberInput.trim()
    if (!trimmed) return

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmed)) {
        alert("Please enter a valid email address")
        return
    }
    if (members.includes(trimmed)) {
        alert("This member has already been added")
        return
    }

    setMembers([...members, trimmed])
    setMemberInput('')
}

    const removeMember = (name) => {
        setMembers(members.filter(m => m !== name))
    }

 const submitHandler = async () => {
    const trimmedName = groupName.trim()

    if (!trimmedName) {
        alert("Please enter a group name")
        return
    }

    const uniqueMembers = [...new Set(members)]

    const token = localStorage.getItem("token")
    const response = await fetch("http://localhost:5000/creategrp", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ grp_name: trimmedName, members: uniqueMembers })
    })
    const result = await response.json()

    if (!response.ok) {
        alert(result.message || "Failed to create group")
        return
    }

    if (result.notFound && result.notFound.length > 0) {
        alert(`Group created, but these emails aren't registered and weren't added: ${result.notFound.join(', ')}`)
    }

    navigate('/groups')
}

    return (
        <div className="page-bg">
            <div className="custom-wrapper">
                <div className="custom-card">
                    <h3 className="card-title">Create a group</h3>

                    <div className="mb-3">
                        <label className="form-label">Group Name</label>
                        <input className="form-control" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Add Members (by email)</label>
                        <input
                            className="form-control"
                            value={memberInput}
                            onChange={(e) => setMemberInput(e.target.value)}
                            placeholder="e.g. k@gmail.com"
                            type="email"
                        />
                        <button type="button" onClick={addMember} className="btn-outline-green mt-8">Add</button>
                    </div>

                    <div className="chip-row">
                        {members.map((m) => (
                            <span key={m} className="bg-light-green text-green member-chip">
                                {m} <button type="button" onClick={() => removeMember(m)} className="chip-remove-btn">×</button>
                            </span>
                        ))}
                    </div>

                    <div className="btn-row">
                        <button type="button" onClick={() => navigate('/groups')} className="btn-outline-green btn-flex">Cancel</button>
                        <button type="button" onClick={submitHandler} className="btn-brand btn-flex">Create group</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGroup