# SplitEase

A Splitwise-style expense tracker — create groups, log shared expenses, and automatically see who owes whom.

## Features

- **Authentication** — signup with email OTP verification, login with JWT, bcrypt-hashed passwords
- **Groups** — create a group, invite members by email (must already have an account), view/delete groups
- **Expenses** — log an expense, split equally among selected members, delete an expense
- **Balances** — live per-member balance within a group (what you're owed / what you owe)
- **Settle up** — record a payment between two members, validated against the actual amount owed
- **Dashboard** — net balance across all your groups in one view
- **Admin panel** — separate admin login, view app-wide stats (total users, groups, expenses, amount)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Bootstrap + custom CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT (jsonwebtoken), bcrypt |
| Email | Nodemailer (Gmail) for OTP delivery |

## Database Schema

```
users            — id, name, email, hashed password
groups_          — id, name, creator (user_id)
group_members    — junction table: which users belong to which groups
expenses         — id, group, who paid, description, amount
expenses_splits  — junction table: how much each member owes per expense
settlements      — recorded payments between members within a group
admin_           — separate admin accounts (email, password, role)
```

`group_members` and `expenses_splits` model the two many-to-many relationships at the core of the app: a group has many members and a user can be in many groups; an expense splits across many people and a person can owe across many expenses.

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=splitease_db
JWT_SECRET=your_secret_key
USER_EMAIL=your_gmail_address
USER_PASSWORD=your_gmail_app_password
```

Run the schema (see `database/schema.sql`) in MySQL Workbench or via CLI, then:
```bash
node index.js
```
Server runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## API Overview

| Route | Method | Purpose |
|---|---|---|
| `/signup` | POST | Start signup, sends OTP |
| `/verifyotp` | POST | Confirm OTP, creates account |
| `/login` | POST | Authenticate, returns JWT |
| `/groups` | GET | List the logged-in user's groups |
| `/creategrp` | POST | Create a group, add members by email |
| `/groups/:grpId` | GET | Group details + member list |
| `/groups/:grpId` | DELETE | Delete a group (creator only) |
| `/groups/:grpId/expenses` | GET | List a group's expenses |
| `/addexpense` | POST | Add an expense, split among selected members |
| `/expenses/:expId` | DELETE | Delete an expense (payer only) |
| `/groups/:grpId/balances` | GET | Per-member balances within a group |
| `/settle` | POST | Record a settlement between two members |
| `/dashboard-summary` | GET | Net balance across all groups |
| `/adminlogin` | POST | Admin authentication |
| `/admin/stats` | GET | App-wide statistics (admin only) |

All routes except signup/login/OTP are protected with JWT verification; group- and expense-scoped routes additionally check that the requester is a member (or the creator/payer, for delete actions).

## Known Limitations

- **Balances are per-user net, not pairwise.** The app shows "you're owed ₹X" / "you owe ₹Y" as an aggregate within a group, not a resolved "who owes whom specifically" debt graph. Real debt-simplification (minimizing transactions) was out of scope for this project.
- **Only registered users can be added to a group.** Inviting an unregistered email is silently skipped, with the frontend surfacing which emails weren't added.
- **Admin passwords are stored in plaintext**, unlike user passwords (bcrypt-hashed) — a deliberate simplification for this project's scope, not a recommended practice for production.

## Author

Sana — [GitHub](https://github.com/Sana3623)