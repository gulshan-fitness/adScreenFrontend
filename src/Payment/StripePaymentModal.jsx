import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { stripePromise } from "./stripePromise";

/* =========================
   Checkout Form
========================= */
function CheckoutForm({ onClose, notify, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {

  e.preventDefault();

  if (!stripe || !elements) {
    notify("Stripe not ready", 0);
    return;
  }

  setLoading(true);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    redirect: "if_required"
  });

  if (error) {
    notify(error.message, 0);
    setLoading(false);
    return;
  }

  // 🔥 CALL BACKEND VERIFY API
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}stripe/verify-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id
        })
      }
    );

    const result = await res.json();

    if (result.status === 1) {
      notify("Payment successful!", 1);
      onSuccess?.(paymentIntent);
      onClose();
    } else if (result.status === 2) {
      notify("Payment processing. Please wait.", 2);
      onClose();
    } else {
      notify("Payment failed", 0);
    }
  } catch (err) {
    notify("Payment verification failed", 0);
  }

  setLoading(false);
};


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 border rounded-lg text-gray-700"
        disabled={loading}
      >
        Cancel
      </button>
    </form>
  );
}

CheckoutForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

/* =========================
   Stripe Modal
========================= */
export default function StripePaymentModal({
  clientSecret,
  onClose,
  notify,
  onSuccess
}) {
  if (!clientSecret) return null;

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#7c3aed",
      borderRadius: "8px"
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-center mb-6">
          Secure Stripe Payment
        </h3>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance
          }}
        >
          <CheckoutForm
            notify={notify}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>

        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Secured by Stripe · PCI-DSS Compliant
        </p>
      </div>
    </div>
  );
}

StripePaymentModal.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};
