
const { Pool } = require("pg");

let pool;

async function connectToDatabase() {
  if (pool) return pool; // reuse if token still valid

  const dbSecret = JSON.parse(process.env.DB_SECRET);

  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: dbSecret.username,
    password: dbSecret.password,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  console.log("Aurora pool created with IAM token");
  return pool;
}

module.exports = { connectToDatabase };