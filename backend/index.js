const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());


// app.get('/api/test', (req, res) => {
    
//   res.json({ message: 'Server is working' })

// });



app.post('/signup', async (req, res) => {
  
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const sql = `INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)`;
    db.query(sql, [req.body.user_name, req.body.user_email, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Insert failed" });
      }
      res.json({ message: "User inserted successfully" });
    });
 
});

app.post('/login', (req, res) => {
  const sql = `SELECT user_id, user_password FROM users WHERE user_email = ?`;
  db.query(sql, [req.body.user_email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const match = await bcrypt.compare(req.body.user_password, user.user_password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", userId: user.user_id });
  });
});

app.post('/groups', (req, res) => {
  const { grp_name, user_id } = req.body;
  const sql1 = `INSERT INTO groups_ (grp_name, user_id) VALUES (?, ?)`;
  db.query(sql1, [grp_name, user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Group creation failed" });

    const grpId = result.insertId; // auto-generated ID from the INSERT
    const sql2 = `INSERT INTO group_members (grp_id, user_id) VALUES (?, ?)`;
    db.query(sql2, [grpId, user_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Member insert failed" });
      res.json({ message: "Group created", grpId });
    });
  });
});

app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log("5000")
})