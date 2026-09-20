-- SplitEase Database Schema (with foreign key constraints)

CREATE DATABASE IF NOT EXISTS splitease_db;
USE splitease_db;

-- Users (root table — everything else references this)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups
CREATE TABLE groups_ (
  grp_id INT AUTO_INCREMENT PRIMARY KEY,
  grp_name VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Group members (many-to-many: users <-> groups)
-- Deleting a group removes its memberships automatically.
CREATE TABLE group_members (
  grp_mem_id INT AUTO_INCREMENT PRIMARY KEY,
  grp_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (grp_id) REFERENCES groups_(grp_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE (grp_id, user_id)
);

-- Expenses
-- Deleting a group removes its expenses automatically.
CREATE TABLE expenses (
  exp_id INT AUTO_INCREMENT PRIMARY KEY,
  grp_id INT NOT NULL,
  user_id INT NOT NULL,
  descri VARCHAR(150) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grp_id) REFERENCES groups_(grp_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Expense splits (many-to-many: expenses <-> users, with amount owed per person)
-- Deleting an expense removes its splits automatically.
CREATE TABLE expenses_splits (
  split_id INT AUTO_INCREMENT PRIMARY KEY,
  exp_id INT NOT NULL,
  user_id INT NOT NULL,
  amount_owed DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (exp_id) REFERENCES expenses(exp_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Settlements (recorded payments between members within a group)
-- Deleting a group removes its settlement records automatically.
CREATE TABLE settlements (
  settle_id INT AUTO_INCREMENT PRIMARY KEY,
  grp_id INT NOT NULL,
  paid_by INT NOT NULL,
  paid_to INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grp_id) REFERENCES groups_(grp_id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(user_id),
  FOREIGN KEY (paid_to) REFERENCES users(user_id)
);

-- Admin accounts (separate from regular users, no relation to the tables above)
CREATE TABLE admin_ (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_email VARCHAR(100) UNIQUE NOT NULL,
  admin_pass VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin'
);