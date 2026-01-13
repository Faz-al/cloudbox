// src/controllers/payment.controller.js

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { tier } = req.body;

    const amount =
      tier === "ads_free_fast" ? 2500 : 1000; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `viewer_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};
