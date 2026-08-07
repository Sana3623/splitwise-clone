import React, { useState } from "react";

function CreateGroupModal({ onClose, onCreate }) {
    const [groupName, setGroupName] = useState('');
    const [memberInput, setMemberInput] = useState('');
    const [members, setMembers] = useState([]);

    const addMember = () => {
        if (memberInput.trim()) {
            setMembers([...members, memberInput.trim()]);
            setMemberInput('');
        }
    };

      let txtGrpHandler = (e) => {
       
        setGroupName (e.target.value)
    }

      let txtMemHandler = (e) => {
       
        setMemberInput (e.target.value)
    }
    const removeMember = (name) => {
        setMembers(members.filter(m => m !== name));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/creategrp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grp_name: groupName, members: members })
        });
        const result = await response.json();
        console.log(result);

        onCreate();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="custom-card modal-card">
                <div>
                    <label>Group Name</label>
                    <input name="groupName" value={groupName} onChange={txtGrpHandler} />
                </div>

                <div>
                    <label>Add Members</label>
                    <input name="memberInput" value={memberInput} onChange={txtMemHandler} />
                    <button type="button" onClick={addMember}>Add</button>
                </div>

                <div>
                    {members.map((m) => (
                        <span key={m}>
                            {m} <button type="button" onClick={() => removeMember(m)}>x</button>
                        </span>
                    ))}
                </div>

                <div>
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={submitHandler}>Create group</button>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupModal;