require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/files.routes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB TEMP OFF
console.log("⚠️ MongoDB skipped (no-DB mode)");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ status: "CloudBox backend running (no-DB mode)" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
