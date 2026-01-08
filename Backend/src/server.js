console.log("🔥 THIS SERVER FILE IS RUNNING");

require("dotenv").config();

const cleanupTrash = require("./jobs/cleanupTrash");


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/files.routes");

const app = express();

/* ===== CORS (COOKIE SAFE) ===== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://cloudbox-frontend-n6gf.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cookieParser());

/* ===== DB ===== */
connectDB();

/* ===== API ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("CloudBox API is running");
});


/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

setInterval(cleanupTrash, 1000 * 60 * 60 * 6); // every 6 hours


