const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quota: { type: Number, default: 5 * 1024 * 1024 * 1024 },


  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
