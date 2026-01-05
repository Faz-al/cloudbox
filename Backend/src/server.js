require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/files.routes");

const app = express();

/* ===== CORS FIX (CORRECT) ===== */
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

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

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.json({ status: "CloudBox backend running" });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
