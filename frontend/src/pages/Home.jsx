import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/style.css'

function Home() {
    const navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate('/groups')
        }
    }, [])

    return (
        <div className="page-bg">
            <div className="custom-wrapper wrapper-column">

                <div className="hero-section">
                    <h1 className="text-green">Split expenses without the awkward math</h1>
                    <p className="text-center-muted">
                        Create a group, add your friends, and let SplitEase work out who owes who.
                    </p>
                    <div className="btn-row hero-btn-row">
                        <button className="btn-brand" onClick={() => navigate('/signup')}>Get started</button>
                        <button className="btn-outline-green" onClick={() => navigate('/login')}>Log in</button>
                    </div>
                </div>

                <div className="feature-grid">
                    <div className="custom-card feature-card">
                        <p className="card-title card-title-left">Create a group</p>
                        <p className="card-subtitle">Start a group for a trip, a flat, or a night out.</p>
                    </div>
                    <div className="custom-card feature-card">
                        <p className="card-title card-title-left">Log an expense</p>
                        <p className="card-subtitle">Add what was spent — SplitEase divides it equally.</p>
                    </div>
                    <div className="custom-card feature-card">
                        <p className="card-title card-title-left">See who owes what</p>
                        <p className="card-subtitle">A live balance for every member, always up to date.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home