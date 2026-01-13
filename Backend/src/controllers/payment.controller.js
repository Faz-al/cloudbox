// src/controllers/payment.controller.js

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require("razorpay");

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

exports.createOrder = async (req, res) => {
  // Payments disabled safely
  if (!razorpay) {
    return res.status(503).json({
      message: "Payments are temporarily disabled",
    });
  }

  try {
    const { tier } = req.body;

    const amount = tier === "ads_free_fast" ? 2500 : 1000; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `viewer_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};
