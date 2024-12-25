const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',          // PostgreSQL username
  host: 'localhost',
  database: 'postgres',      // PostgreSQL database name
  password: 'Avih$@123',     // PostgreSQL password
  port: 5432
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routing for login, register, and profile
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
});

// Handle registration request
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE first_name = $1', [firstName]);
    if (result.rows.length > 0) {
      res.json({ success: false, message: 'Username already exists' });
    } else {
      await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, password]);
      res.json({ success: true, username: firstName });
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.json({ success: false, message: 'Registration failed' });
  }
});

// Handle login request
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, username: result.rows[0].first_name });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.json({ success: false, message: 'Login failed' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
