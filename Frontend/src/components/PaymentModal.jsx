import { useEffect } from "react";
import { API_BASE } from "../utils/api";

export default function PaymentModal({ tier, fileId, onSuccess, onClose }) {
  useEffect(() => {
    const loadScript = () =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const startPayment = async () => {
      await loadScript();

      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const order = await res.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "CloudBox",
        description: "Remove ads",
        order_id: order.id,
        handler: () => {
          onSuccess();
        },
        modal: {
          ondismiss: onClose,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    startPayment();
  }, [tier, fileId, onSuccess, onClose]);

  return null;
}
