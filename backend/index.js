const db = require('./db_config')
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

let otpStorage = {}
const saltRounds = 10


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

let generateToken=(user_id,user_email,role)=>{
    return jwt.sign({user_id,user_email,role},secretkey,{expiresIn: '1h' })
    
}

let verifyToken = (req,res)=>{
    console.log(req.headers.authorization.split(" ")[1])
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
     console.log("Full req.body:", req.body)
     
    const { userOtp, userEmail } = req.body
      console.log("Current otpStorage:", otpStorage)   // add this
    console.log("Looking for email:", userEmail)

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
                console.log("true")
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
        } else {
            if (result.length == 0) {
                return res.status(404).json({ message: "User Not Found " })
            }
            else {


                let op = await bcrypt.compare(user_password, result[0].user_password)
                if (op) {
                 let token= await generateToken(result[0].user_id,result[0].user_email);
                 return res.status(200).json(token)
                    
                } else {
                    return res.status(400).json({ message: "Incorrect password" })
                }
            }
        }


    })
})
 

app.post('/groups', (req, res) => {
  const { grp_name, user_id } = req.body;
  const sql1 = `INSERT INTO groups_ (grp_name, user_id) VALUES (?, ?)`
  db.query(sql1, [grp_name, user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Group creation failed" })

    const grpId = result.insertId; // auto-generated ID from the INSERT
    const sql2 = `INSERT INTO group_members (grp_id, user_id) VALUES (?, ?)`
    db.query(sql2, [grpId, user_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Member insert failed" });
      res.json({ message: "Group created", grpId })
    })
  })
})

app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log("5000")
})