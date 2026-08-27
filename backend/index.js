const db = require('./db_config')
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
var jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const app = express()
app.use(cors())
app.use(express.json())

let otpStorage = {}
const saltRounds = 10


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

let generateToken=(id,email,role)=>{
    return jwt.sign({id,email,role},process.env.JWT_SECRET,{expiresIn: '1h' })
    
}

let verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: "User Unauthorized" })

    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ message: "User Unauthorized" })

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) return res.status(403).json({ message: "Invalid Token" })
        req.user = decoded
        next()
    })
}

const authorizeRoles = roles => async (req,res,next) => {
    
    if (roles.includes(req.user.role)==false) return res.status(403).json({error:"Access Denied"})
        next()
}


app.post('/signup', async (req, res) => {
  
    const { user_name, user_email, user_password } = req.body

     const sql = 'SELECT * FROM users WHERE user_email = ?'

    db.query(sql, [user_email], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Server error' })
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists' })
        } else {

            const otp = Math.floor(100000 + Math.random() * 900000)
            console.log(otp)
            otpStorage[user_email] = { otp, expireAt: Date.now() + 2 * 60 * 1000, userDetails: { user_name, user_email, user_password } }
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: user_email,
                subject: 'Your Otp Code',
                text: `Your Otp is ${otp}`
            }

            await transporter.sendMail(mailOptions)
        }

        return res.status(200).json({ message: "OTP sent" })
    })
})

app.post('/verifyotp', (req, res) => {
    
     
    const { userOtp, userEmail } = req.body
     

    if (!otpStorage[userEmail]) {
        return res.status(400).json({ message: "Otp not requested" })
    }

    if (otpStorage[userEmail].expireAt < Date.now()) {
        delete otpStorage[userEmail]
        return res.status(400).json({ message: "Otp Expired" })
    }

    if (otpStorage[userEmail].otp == userOtp) {
        const { user_name, user_phone, user_email, user_password } = otpStorage[userEmail].userDetails
        const sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)'

        bcrypt.hash(user_password, saltRounds, function (err, hash) {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: "Error hashing password" })
            }

            db.query(sql, [user_name, user_email, hash], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ message: "Insert failed" })
                }
                return res.status(201).json({ message: "User registered successfully" })
                
            })
        })
    } else {
        return res.status(400).json({ message: "Incorrect OTP" })
        console.log("False")
    }
})

app.post('/login', (req, res) => {
    const { user_email, user_password } = req.body
    const sql = 'SELECT * FROM users WHERE user_email = ?'

    db.query(sql, [user_email], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Server error' })
        }
        if (result.length == 0) {
            return res.status(404).json({ message: "User Not Found" })
        }

        let op = await bcrypt.compare(user_password, result[0].user_password)
        if (op) {
            let token = generateToken(result[0].user_id, result[0].user_email, 'user')
            return res.status(200).json({ token, user_id: result[0].user_id })
        } else {
            return res.status(400).json({ message: "Incorrect password" })
        }
    })
})
 

app.post('/adminlogin', (req, res) => {

    const { admin_email, admin_pass } = req.body

    const sql = `SELECT * FROM admin_ WHERE admin_email = ?`

    db.query(sql, [admin_email], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Server error' })
        }

        if (result.length == 0) {
            return res.status(404).json({ message: "User Not Found" })
        }

        if (admin_pass == result[0].admin_pass)  {
            let token = generateToken(result[0].admin_id, result[0].admin_email, result[0].role)
            return res.status(200).json({token,role:result[0].role})  
        } else {
            return res.status(400).json({ message: "Incorrect password" })
        }
    })
})

app.get('/groups', verifyToken, (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT g.grp_id, g.grp_name
        FROM groups_ g
        JOIN group_members gm ON g.grp_id = gm.grp_id
        WHERE gm.user_id = ?`

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Failed to fetch groups" })
        }
        res.json(result)
    })
})


app.post('/creategrp', verifyToken, async (req, res) => {
    const { grp_name, members } = req.body
    const userId = req.user.id   // from the verified token, not the request body

    const sql1 = `INSERT INTO groups_ (grp_name, user_id) VALUES (?, ?)`
    db.query(sql1, [grp_name, userId], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Group creation failed" })
        }

        const grpId = result.insertId
        const sql2 = `INSERT INTO group_members (grp_id, user_id) VALUES (?, ?)`
        db.query(sql2, [grpId, userId], async (err2) => {
            if (err2) {
                console.log(err2)
                return res.status(500).json({ message: "Member insert failed" })
            }

            for (const email of (members || [])) {
                const [userRows] = await db.promise().query(
                    `SELECT user_id FROM users WHERE user_email = ?`, [email]
                )
                if (userRows.length === 0) continue
                await db.promise().query(
                    `INSERT INTO group_members (grp_id, user_id) VALUES (?, ?)`,
                    [grpId, userRows[0].user_id]
                )
            }

            res.json({ message: "Group created", grpId })
        })
    })
})


app.get('/groups/:grpId', verifyToken, (req, res) => {
    const { grpId } = req.params

    const groupSql = `SELECT grp_id, grp_name FROM groups_ WHERE grp_id = ?`
    const membersSql = `
        SELECT u.user_id, u.user_name, u.user_email
        FROM group_members gm
        JOIN users u ON gm.user_id = u.user_id
        WHERE gm.grp_id = ?
    `

    db.query(groupSql, [grpId], (err, groupResult) => {
        if (err) return res.status(500).json({ message: "Failed to fetch group" })
        if (groupResult.length === 0) return res.status(404).json({ message: "Group not found" })

        db.query(membersSql, [grpId], (err2, memberResult) => {
            if (err2) return res.status(500).json({ message: "Failed to fetch members" })

            res.json({
                group: groupResult[0],
                members: memberResult
            })
        })
    })
})

app.get('/dashboard-summary', verifyToken, (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT 
            g.grp_id, 
            g.grp_name,
            COALESCE(paid.total_paid, 0) - COALESCE(owed.total_owed, 0) AS net_balance
        FROM groups_ g
        JOIN group_members gm ON g.grp_id = gm.grp_id AND gm.user_id = ?
        LEFT JOIN (
            SELECT grp_id, SUM(amount) AS total_paid 
            FROM expenses WHERE user_id = ? GROUP BY grp_id
        ) paid ON paid.grp_id = g.grp_id
        LEFT JOIN (
            SELECT e.grp_id, SUM(es.amount_owed) AS total_owed
            FROM expenses_splits es
            JOIN expenses e ON es.exp_id = e.exp_id
            WHERE es.user_id = ?
            GROUP BY e.grp_id
        ) owed ON owed.grp_id = g.grp_id
    `

    db.query(sql, [userId, userId, userId], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Failed to fetch dashboard summary" })
        }
        res.json(result)
    })
})

app.get('/admin/stats', verifyToken, authorizeRoles(['admin']), (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM groups_) AS total_groups,
            (SELECT COUNT(*) FROM expenses) AS total_expenses,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_amount
    `
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Failed to fetch stats" })
        }
        res.json(result[0])
    })
})
app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log("5000")
})