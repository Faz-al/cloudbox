
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


/* ===== CORS (COOKIE SAFE) ===== */
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS not allowed"));
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
app.use("/api/viewer", viewerRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);



app.use("/api/dmca", dmcaRoutes);
app.use("/api/admin/dmca", adminDmcaRoutes);


app.use("/api/files", authMiddleware, securityTracker);


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


