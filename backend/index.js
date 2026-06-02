require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

// const port = 5001

const cors = require('cors');

app.use(cors({
  origin: "*", // for demo only
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

const { connectToDatabase } = require('./database');

(async () => {
  try {
    const pool = await connectToDatabase();
    await pool.query("SELECT NOW()");
    console.log("Successfully connected to Aurora PostgreSQL");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

async function testConnection() {
  try {
    const pool = await connectToDatabase();
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  }
}


app.get('/health', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.get('/tasks', async (req, res) => {

  testConnection();

  try {
    const pool = await connectToDatabase();
    if (pool) {console.log(`pool ok`);}
    const result = await pool.query('SELECT * FROM public."Tasks";'); // adjust table name as needed
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});





app.listen(port, () => {
  console.log(`Server started on ${port}`);
  console.log({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER
  });
});


























// // CloudFront secret header middleware
// app.use((req, res, next) => {
//   // Bypass check for ALB health checks
//   if (req.path === '/health') return next();

//   const secret = req.headers['x-cloudfront-secret'];
//   if (!secret || secret !== process.env.CLOUDFRONT_SECRET) {
//     return res.status(403).json({ error: 'Forbidden' });
//   }
//   next();
// });