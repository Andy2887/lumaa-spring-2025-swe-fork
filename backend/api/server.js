const express = require("express");
const cors = require("cors");
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const salt = bycrypt.genSaltSync(10);
const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const app = express();
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());
// Parses cookies attached to client requests
app.use(cookieParser());



// default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to your Express server" });
});

// register user
app.post('/auth/register', async (req, res) => {
  const {username, password} = req.body;
  const hash = bycrypt.hashSync(password, salt);

  const query = `INSERT INTO users (username, password) VALUES ($1, $2)`;
  const values = [username, hash];

  try {
    await pool.query(query, values);
    res.status(200).json({message: 'User created'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }

});

// login user
app.post('/auth/login', async (req, res) => {
  const {username, password} = req.body;

  // find hash password
  const query = `SELECT * FROM users WHERE username = $1`;
  const values = [username];

  try {
    const result = await pool.query(query, values);
    const userid = result.rows[0].id;
    
    if (result.rows.length === 0) {
      res.status(400).json({message: 'Invalid username or password'});
      return;
    }

    const hash = result.rows[0].password;
    const success = bycrypt.compareSync(password, hash);

    if (!success) {
      res.status(400).json({message: 'Invalid username or password'});
      return;
    }

    jwt.sign({username, userid}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
      if (err){
          res.status(400).json(err);
      }
      else{
          res.cookie('token', token).json({message: 'success', userid: userid, username: username});
      }
    });


  } catch (error) {
    res.status(500).json({message: error.message});
  }

});

// This would return the profile information of the user
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
      }
      res.json(decoded);
  });
});

// This would logout the user
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token').json({message: 'success'});
});


// return profile information
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.status(400).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }
      res.status(200).json(decoded);
  });
});

app.get('/tasks', async (req, res) => {
  const query = `SELECT * FROM tasks`;
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a new task
app.post('/tasks', async (req, res) => {
  const {title, description, userid} = req.body;
  const query = `INSERT INTO tasks (title, description, userid) VALUES ($1, $2, $3)`;
  const values = [title, description, userid];

  try {
    await pool.query(query, values);
    res.status(200).json({message: 'Task created'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// update a task
app.put('/tasks/:id', async (req, res) => {
  const {is_complete} = req.body;
  const id = req.params.id;

  const query = `UPDATE tasks SET is_complete = $1 WHERE id = $2`;
  const values = [is_complete, id];

  try {
    await pool.query(query, values);
    res.status(200).json({message: 'Task updated'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// delete a task
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM tasks WHERE id = $1`;
  const values = [id];

  try {
    await pool.query(query, values);
    res.status(200).json({message: 'Task deleted'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;