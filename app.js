const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');  // For handling user sessions
const { Pool } = require('pg');
const cors = require('cors');  // If needed for cross-origin requests

const app = express();
const saltRounds = 10;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true,
}));

// app.use(cors()); // Enable CORS if frontend and backend are on different ports
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Use secure cookies if HTTPS is enabled
}));
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_secret_key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//   }
// }));

// PostgreSQL configuration
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Avih$@123',
  port: 5432,
});
// Test database connection 
pool.query('SELECT NOW()', (err, res) => { 
  if (err) { 
    console.error('Error connecting to the database:', err); 
  } 
  else { 
    console.log('Database connected successfully:', res.rows); 
  } 
});
const helmet = require('helmet');
app.use(helmet());

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
});


// Handle login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "You haven't registered yet. Please sign up!" });
    }

    const hashedPassword = result.rows[0].password;
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      req.session.user = {
        email,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name,
        // phone: result.rows[0].phone,
      };
      res.json({
        message: 'Login successful',
        user: req.session.user, // Return user data
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    // res.status(500).json({ message: 'Error logging in', error: error.message });
    res.status(500).json({ message: 'Internal server error' });

  }
});

// Get user info (api/user)
app.get('/api/user', (req, res) => {
  const user = req.session.user; // Get user data from session
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});

// Update user info (api/user PUT)
app.put('/api/user', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const user = req.session.user;

  if (user) {
    try {
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE email = $4 RETURNING *',
        [first_name, last_name, email, user.email]
      );      

      req.session.user = result.rows[0]; // Update session with new data
      res.json({ message: 'User updated successfully', user: req.session.user });
    } catch (error) {
      console.error('Error updating user:', error);
      // res.status(500).json({ message: 'Error updating user', error: error.message });
      res.status(500).json({ message: 'Internal server error' });

    }
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});

// Handle registration
app.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
    });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  // Clear session or authentication cookies
  res.clearCookie('authToken');
  res.status(200).send({ message: 'Logged out successfully' });
});

// app.post('/logout', (req, res) => {
//   req.session.destroy(() => {
//       res.redirect('/login.html'); // Ensure correct login page path
// //   });
// // });
//     res.clearCookie('connect.sid'); // Clear the session cookie
//     // res.json({ message: 'Logged out successfully' });
//     res.status(200).json({ message: 'Logged out successfully' });
//   });
// });

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

