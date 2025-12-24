import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { stripePromise } from "./stripePromise";
import { Context } from "../Context_holder";
import { useNavigate } from "react-router-dom";

/* =========================
   Checkout Form
========================= */
function CheckoutForm({
  onClose,
  notify,
  onSuccess,
  booking_id,
  BookingdoneHandler,
  setstep
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const{ setPaymentSuccessPopUp,setPaymentSuccesdData, }=useContext(Context)

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
      console.log(result, ">>>>>>>>>> result");

      if (result.status === 1) {
       
        onSuccess?.(paymentIntent);

        const bookingRes = await BookingdoneHandler(
          result?.Transaction_id,
          booking_id
        );

        if (bookingRes?.status === 1 && result) {
            setPaymentSuccesdData(result?.data)
         setPaymentSuccessPopUp(true)
         setstep(true)
       
        }

        onClose?.();
      } else if (result.status === 2) {
        notify("Payment processing. Please wait.", 2);
        onClose?.();
      } else {
        notify("Payment failed", 0);
      }
    } catch (err) {
      notify("Payment verification failed", 0);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5"
    >
      {/* Stripe Elements */}
      <div className="p-3 sm:p-4 border rounded-lg">
        <PaymentElement />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 sm:py-3.5 rounded-lg text-base sm:text-lg font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="w-full py-3 border rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
    </form>
  );
}

CheckoutForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  booking_id: PropTypes.string,
  BookingdoneHandler: PropTypes.func.isRequired
};

/* =========================
   Stripe Modal
========================= */
export default function StripePaymentModal({
  clientSecret,
  onClose,
  notify,
  onSuccess,
  booking_id,
  setstep
}) {
  const { BookingdoneHandler } = useContext(Context);

  if (!clientSecret) return null;

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#7c3aed",
      borderRadius: "8px"
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center">
      {/* Modal */}
      <div
        className="
          bg-white w-full sm:max-w-md
          rounded-t-2xl sm:rounded-2xl
          p-4 sm:p-6
          max-h-[90vh] overflow-y-auto
          relative
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6">
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
            booking_id={booking_id}
            BookingdoneHandler={BookingdoneHandler}
            setstep={setstep}
          />
        </Elements>

        <p className="text-[11px] sm:text-xs text-center text-gray-500 mt-4">
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
  onSuccess: PropTypes.func,
  booking_id: PropTypes.string
};
