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
        if (memberInput.trim()) {
            setMembers([...members, memberInput.trim()])
            setMemberInput('')
        }
    }

    const removeMember = (name) => {
        setMembers(members.filter(m => m !== name))
    }

    const submitHandler = async () => {
        const token = localStorage.getItem("token")
        console.log("token being sent:", token)
        console.log("userId being sent:", currentUserId)

        const response = await fetch("http://localhost:5000/creategrp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ grp_name: groupName, members: members })
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
                        <input className="form-control" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Add Members</label>
                        <input className="form-control" value={memberInput} onChange={(e) => setMemberInput(e.target.value)} />
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