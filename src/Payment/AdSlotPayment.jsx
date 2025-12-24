import React, { useContext, useState } from "react";
import { SiRazorpay } from "react-icons/si";
import { FaStripe, FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import axios from "axios";

import { Context } from "../Context_holder";
import StripePaymentModal from "./StripePaymentModal";

/* ================= RAZORPAY SDK LOADER ================= */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ================= MAIN COMPONENT ================= */
export default function AdSlotPayment({ selectedBooking, setstep }) {
  const { BookingdoneHandler, setPaymentSuccessPopUp, setPaymentSuccesdData,slotConfirmHandler } = useContext(Context);
  const { notify, user, getCurrencySymbol, usertoken } = useContext(Context);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showStripe, setShowStripe] = useState(false);

  /* ================= STRIPE PAYMENT FOR AD SLOT ================= */
  const handleStripePayment = async () => {
    if (!selectedBooking || !usertoken) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}stripe/create-payment-intent/${selectedBooking?._id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: usertoken,
          }
        }
      );

      if (res.data.status === 1) {
        setClientSecret(res.data.clientSecret);
        setShowStripe(true);
      } else {
        notify(res.data.msg || "Failed to create payment intent", 0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Stripe payment error:", error);
      const errorMsg = error.response?.data?.msg ||
        error.response?.data?.error?.message ||
        error.message ||
        "Payment processing failed";
      notify(errorMsg, 0);
      setLoading(false);
    }
  };

  /* ================= RAZORPAY PAYMENT FOR AD SLOT ================= */
  const handleRazorpayPayment = async () => {
    if (!selectedBooking || !usertoken) return;

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        notify("Razorpay SDK failed to load", 0);
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorcreateorder/${selectedBooking?._id}`,
        {},
        {
          headers: {
            Authorization: usertoken,
          }
        }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.msg || "Failed to create order");
      }

      const { order, transactionId } = response.data;

      if (!order || !order.id) {
        throw new Error("Invalid order response");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        name: "Digital Ads Platform",
        description: `Ad Slot Booking: ${selectedBooking?.screen_id?.screenName}`,
        handler: async (paymentResponse) => {
          try {
            const verifyPayload = {
              transactionId: transactionId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              amount: order.amount / 100,
              currency: order.currency || "INR",
              booking_id: selectedBooking?._id
            };

            const verify = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorverifypayment`,
              verifyPayload,
              {
                headers: {
                  Authorization: usertoken,
                }
              }
            );

            if (verify.data.status === 1) {
              const res = await BookingdoneHandler(
                transactionId,
                selectedBooking?._id
              );

              if (res?.status === 1) {
                setPaymentSuccesdData({ price: verifyPayload?.amount, currency: verifyPayload?.currency });
                setPaymentSuccessPopUp(true);
                setstep(true);
              }
            } else {
              notify("Payment verification failed", 0);
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            notify("Payment verification failed", 0);
          }
        },
        prefill: {
          name: user?.name || "Advertiser",
          email: user?.email || "advertiser@example.com",
          contact: user?.phone || "9876543210"
        },
        notes: {
          booking_id: selectedBooking?._id,
          slot_id: selectedBooking?.slot_id,
          screen: selectedBooking?.screen_id?.screenName
        },
        theme: { color: "#6366F1" }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        notify(`Payment failed: ${response.error.description}`, 0);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      notify(err.response?.data?.msg || "Payment processing failed", 0);
    } finally {
      setLoading(false);
    }
  };


  console.log(selectedBooking,"selectedBooking");
  
  /* ================= MAIN PAYMENT HANDLER ================= */
  const handlePayment = async () => {
    if(!selectedBooking) return

    const res = await slotConfirmHandler(
                selectedBooking?.slot_id
              );

              if (res?.status === 1) {
                  if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      await handleStripePayment();
    }
              
              }
             else {
              notify("This slot already booked", 0);
            }

  
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Secure Payment
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
            Complete your ad slot booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
              {/* Payment Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <BsFillCreditCard2FrontFill className="text-lg sm:text-xl md:text-2xl text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                    Payment Method
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">Choose your preferred payment option</p>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Razorpay Card */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "razorpay"
                    ? "border-indigo-500 bg-indigo-50 shadow-md sm:shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm sm:hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-white p-1.5 sm:p-2 md:p-2.5 rounded sm:rounded-lg">
                        <SiRazorpay className="text-xl sm:text-2xl md:text-3xl text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800">Razorpay</h3>
                        <p className="text-xs text-gray-500">India & International</p>
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <FaCheckCircle className="text-lg sm:text-xl md:text-2xl text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                      <span>UPI, Cards & Net Banking</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                      <span>Instant Processing</span>
                    </div>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                      SELECTED
                    </div>
                  )}
                </div>

                {/* Stripe Card */}
                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={`relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "stripe"
                    ? "border-purple-500 bg-purple-50 shadow-md sm:shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm sm:hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-white p-1.5 sm:p-2 md:p-2.5 rounded sm:rounded-lg">
                        <FaStripe className="text-xl sm:text-2xl md:text-3xl text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800">Stripe</h3>
                        <p className="text-xs text-gray-500">Global Payments</p>
                      </div>
                    </div>
                    {paymentMethod === "stripe" && (
                      <FaCheckCircle className="text-lg sm:text-xl md:text-2xl text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                      <span>International Cards</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                      <span>Apple Pay & Google Pay</span>
                    </div>
                  </div>
                  {paymentMethod === "stripe" && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-purple-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                      SELECTED
                    </div>
                  )}
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaLock className="text-xs sm:text-sm text-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">SSL Secure</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaShieldAlt className="text-xs sm:text-sm text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaCreditCard className="text-xs sm:text-sm text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 lg:sticky lg:top-8">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Screen</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800 text-right max-w-[50%] truncate">
                    {selectedBooking?.screen_id?.screenName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Duration</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {selectedBooking?.duration_minutes} mins
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Date & Time</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800 text-right">
                    {new Date(selectedBooking?.start_datetime).toLocaleDateString()}<br />
                    {new Date(selectedBooking?.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl px-3 sm:px-4">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Total Amount</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                      {getCurrencySymbol(selectedBooking?.currency)}{selectedBooking?.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-[0.98]"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-t-2 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-sm md:text-base">Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <FaLock className="text-white text-xs sm:text-sm" />
                    <span className="text-xs sm:text-sm md:text-base">
                      Pay {getCurrencySymbol(selectedBooking?.currency)}{selectedBooking?.price}
                    </span>
                  </>
                )}
              </button>

              {/* Return to Booking */}
              <button
                onClick={() => setstep(true)}
                className="w-full text-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium py-2 sm:py-3 mt-3 sm:mt-4 transition-colors"
              >
                ← Return to booking
              </button>

              {/* Payment Guarantee */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <FaShieldAlt className="text-green-600 text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm font-medium text-green-800">Payment Guarantee</span>
                </div>
                <p className="text-[10px] sm:text-xs text-green-700">
                  Your payment is 100% secure. We use industry-standard encryption and never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded sm:rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">Instant Confirmation</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Get your booking confirmed immediately after payment
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="bg-green-100 p-1.5 sm:p-2 rounded sm:rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">Secure Payment</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Bank-level security with 256-bit encryption
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="bg-purple-100 p-1.5 sm:p-2 rounded sm:rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">24/7 Support</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Get help anytime with our dedicated support team
            </p>
          </div>
        </div>
      </div>

      {/* STRIPE PAYMENT MODAL */}
      {showStripe && clientSecret && (
        <StripePaymentModal
          clientSecret={clientSecret}
          notify={notify}
          onClose={() => {
            setShowStripe(false);
            setClientSecret(null);
          }}
          booking_id={selectedBooking?._id}
          setstep={setstep}
        />
      )}
    </div>
  );
}