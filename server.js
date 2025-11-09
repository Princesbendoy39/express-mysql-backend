// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Pool } = require("pg");
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS so Vercel frontend can call the backend
const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel frontend
  "http://localhost:5173"   // for local dev
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Products REST API." });
});

// ✅ Example DB test endpoint (optional)
app.get("/api/testdb", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ serverTime: rows[0].now });
  } catch (err) {
    console.error("DB test failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/products", productRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    detail: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
