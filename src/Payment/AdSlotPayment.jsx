import React, { useContext, useState } from "react";
import { SiRazorpay } from "react-icons/si";
import { FaStripe, FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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

/* ================= STATIC DATA FOR AD SLOT BOOKING ================= */
const STATIC_SLOT_BOOKING_DATA = {
  booking_id: "67a1b2c3d4e5f67890123456",
  slot_id: "67a1b2c3d4e5f67890123457",
  screen_id: "67a1b2c3d4e5f67890123458",
  advertiser_id: "67a1b2c3d4e5f67890123459",
  slot_details: {
    start_datetime: "2024-12-20T10:00:00Z",
    end_datetime: "2024-12-20T11:00:00Z",
    duration_minutes: 60,
    screen_name: "Main Display Screen 1",
    location: "Times Square, NYC"
  },
  ad_details: {
    ad_title: "Holiday Sale Campaign",
    ad_duration: 30,
    files_count: 3,
    ad_format: "Video MP4"
  }
};

/* ================= MAIN COMPONENT ================= */
export default function AdSlotPayment({ selectedBooking ,setstep}) {

  console.log(selectedBooking,"selectedBooking>>>>>");
  

  const {BookingdoneHandler}=useContext(Context)
  const location = useLocation();
  const bookingData = location.state?.bookingData || STATIC_SLOT_BOOKING_DATA;
  const { notify, user, getCurrencySymbol, usertoken } = useContext(Context);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [price] = useState(5000);
  const [clientSecret, setClientSecret] = useState(null);
  const [showStripe, setShowStripe] = useState(false);
  const [currency] = useState("USD");
  const [Booking_id] = useState("6942589526e2ad55930564cd");
  const navigate = useNavigate();



  /* ================= STRIPE PAYMENT FOR AD SLOT ================= */
  const handleStripePayment = async () => {
    if(!selectedBooking) return
    try {
      
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}stripe/create-payment-intent/${selectedBooking?._id}`,
        {
          headers: {
            'Content-Type': 'application/json'
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
     if(!selectedBooking) return
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        notify("Razorpay SDK failed to load", 0);
        return;
      }

      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorcreateorder/${selectedBooking?._id}`,
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.msg || "Failed to create order");
      }

      const { order } = response.data;
      if (!order || !order.id) {
        throw new Error("Invalid order response");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        name: "Digital Ads Platform",
        description: `Ad Slot Booking: ${bookingData.slot_details.screen_name}`,
        handler: async (response_data) => {
          try {
            const verifyPayload = {
              ...response_data,
              booking_id: bookingData.booking_id,
              transactionId: response?.data?.transactionId
            };

            const verify = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorverifypayment`,
              verifyPayload
            );

            if (verify.data.status === 1) {

          const res=await    BookingdoneHandler( response.data.transactionId,bookingData.booking_id)

          if(res?.status==1){
            navigate("/paymentsuccess")
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
          booking_id: bookingData.booking_id,
          slot_id: bookingData.slot_id,
          screen: bookingData.slot_details.screen_name
        },
        theme: { color: "#6366F1" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        notify(`Payment failed: ${response.error.description}`, 0);
      });
      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error("Razorpay error:", err);
      notify(err.response?.data?.msg || "Payment processing failed", 0);
      setLoading(false);
    }
  };

  /* ================= MAIN PAYMENT HANDLER ================= */
  const handlePayment = async () => {
    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      await handleStripePayment();
    }
  };

  /* ================= STRIPE PAYMENT SUCCESS HANDLER ================= */


  /* ================= UI RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Secure Payment
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Complete your ad slot booking with secure payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              {/* Payment Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <BsFillCreditCard2FrontFill className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                  <p className="text-gray-500">Choose your preferred payment option</p>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Razorpay Card */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "razorpay"
                    ? "border-indigo-500 bg-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2.5 rounded-lg">
                        <SiRazorpay className="text-3xl text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Razorpay</h3>
                        <p className="text-sm text-gray-500">India & International</p>
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <FaCheckCircle className="text-2xl text-green-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>UPI, Cards & Net Banking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Instant Processing</span>
                    </div>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SELECTED
                    </div>
                  )}
                </div>

                {/* Stripe Card */}
                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "stripe"
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2.5 rounded-lg">
                        <FaStripe className="text-3xl text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Stripe</h3>
                        <p className="text-sm text-gray-500">Global Payments</p>
                      </div>
                    </div>
                    {paymentMethod === "stripe" && (
                      <FaCheckCircle className="text-2xl text-green-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>International Cards</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Apple Pay & Google Pay</span>
                    </div>
                  </div>
                  {paymentMethod === "stripe" && (
                    <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SELECTED
                    </div>
                  )}
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <FaLock className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Screen</span>
                  <span className="font-medium text-gray-800">{selectedBooking?.screen_id?.screenName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-800">{selectedBooking?.duration_minutes} mins</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium text-gray-800 text-right">
                    {new Date(selectedBooking?.start_datetime).toLocaleDateString()}<br />
                    {new Date(selectedBooking?.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
               
              </div>

              {/* Total Amount */}
              <div className="mb-8">
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4">
                  <div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {getCurrencySymbol(selectedBooking?.currency)}{selectedBooking?.price}
                    </div>
                  </div>
                 
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaLock className="text-white" />
                    Pay {getCurrencySymbol(selectedBooking?.currency)}{selectedBooking?.price}
                  </>
                )}
              </button>

              {/* Cancel Link */}
              <button
                onClick={() => setstep(true)}
                className="w-full text-center text-gray-500 hover:text-gray-700 font-medium py-3 mt-4 transition-colors"
              >
                ← Return to booking
              </button>

              {/* Payment Guarantee */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaShieldAlt className="text-green-600" />
                  <span className="font-medium text-green-800">Payment Guarantee</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment is 100% secure. We use industry-standard encryption and never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Instant Confirmation</h3>
            </div>
            <p className="text-sm text-gray-600">Get your booking confirmed immediately after payment</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Secure Payment</h3>
            </div>
            <p className="text-sm text-gray-600">Bank-level security with 256-bit encryption</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">24/7 Support</h3>
            </div>
            <p className="text-sm text-gray-600">Get help anytime with our dedicated support team</p>
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
        />
      )}
    </div>
  );
}