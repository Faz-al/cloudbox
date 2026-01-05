require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/files.routes");

const app = express();

/* ===== CORS (COOKIE SAFE) ===== */
const allowedOrigins = [
  "http://localhost:3000",
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

/* ===== SERVE FRONTEND (PRODUCTION) ===== */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

/* ===== API ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/api/health", (req, res) => {
  res.json({ status: "CloudBox backend running" });
});

/* ===== SPA FALLBACK (CRITICAL) ===== */
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../client/build/index.html")
    );
  });
}

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
