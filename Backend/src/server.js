
const dmcaRoutes = require("./routes/dmca.routes");
const adminDmcaRoutes = require("./routes/admin.dmca.routes");

const authMiddleware = require("./middleware/auth.middleware");
const securityTracker = require("./middleware/securityTracker");




console.log("🔥 THIS SERVER FILE IS RUNNING");


require("dotenv").config();

const cleanupTrash = require("./jobs/cleanupTrash");


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const viewerRoutes = require("./routes/viewer.routes");

const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/files.routes");

const paymentRoutes = require("./routes/payment.routes");

const adminAuthRoutes = require("./routes/admin.auth.routes");
const adminRoutes = require("./routes/admin.routes");






const app = express();
app.set("etag", false);

const path = require("path");

// SERVE PUBLIC ROOT FILES (sw.js, robots.txt, etc)
app.use(express.static("public"));



/* ===== CORS (COOKIE SAFE) ===== */
/* ===== CORS (PRODUCTION SAFE) ===== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",

  // PRODUCTION FRONTEND
  "https://safevault.in",
  "https://www.safevault.in",
  "https://app.safevault.in",   // if you use app subdomain
  "https://admin.safevault.in"  // if admin panel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: handle preflight
app.options("*", cors());



/* ===== MIDDLEWARE ===== */
app.use(express.json({ limit: "1mb" }));

app.use(cookieParser());



/* ===== DB ===== */
connectDB();

/* ===== API ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/viewer", viewerRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);



app.use("/api/dmca", dmcaRoutes);
app.use("/api/admin/dmca", adminDmcaRoutes);




/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("SafeVault API is running");
});


/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

});

setInterval(cleanupTrash, 1000 * 60 * 60 * 6); // every 6 hours


