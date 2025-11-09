// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Pool } = require("pg");
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS setup: allow frontend (Vercel) and local dev
const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel frontend URL
  "http://localhost:5173"   // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection (Neon/PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection on startup
pool.connect()
  .then(client => {
    console.log("✅ Connected to Neon database!");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Products REST API." });
});

// Optional test route to verify DB works
app.get("/api/testdb", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ serverTime: rows[0].now });
  } catch (err) {
    console.error("DB test failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Product routes
app.use("/api/products", productRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    detail: process.env.NODE_ENV === "production" ? null : err.message
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
