const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// DB configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'loginDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a pool
const pool = mysql.createPool(dbConfig);

// ===== Signup =====
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  pool.query(
    'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(err);
        return res.status(500).json({ message: 'DB error' });
      }
      res.json({ message: 'Signup successful!' });
    }
  );
});

// ===== Login =====
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'DB error' });
      }

      if (results.length > 0) {
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  );
});

app.listen(5000, () => console.log('Backend running on port 5000'));
