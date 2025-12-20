import React, { useContext, useState } from "react";
import { SiRazorpay } from "react-icons/si";
import { FaStripe } from "react-icons/fa";
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
  booking_id: "67a1b2c3d4e5f67890123456", // Static booking ID
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
    ad_duration: 30, // seconds
    files_count: 3,
    ad_format: "Video MP4"
  }
};

/* ================= MAIN COMPONENT ================= */
export default function AdSlotPayment({slotBookingPayload}) {
  const location = useLocation();
  const bookingData = location.state?.bookingData || STATIC_SLOT_BOOKING_DATA;
  

  const { notify, user,getCurrencySymbol ,usertoken} = useContext(Context);


const apiHandler = async (Payload) => {
  if (!usertoken) throw new Error("Unauthorized");
   

  const fd = new FormData();

  if (Payload?.adfiles) {
  for (const item of Payload?.adfiles) {
      fd.append("file", item);
    }

    
  }

  const { adfiles, ...rest } = Payload;
  fd.append("data", JSON.stringify(rest));

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}createBooking`,
      fd,
      { headers: { Authorization: usertoken } }
    );

    const { data } = response;
    notify(data.msg, data.status);

    if (data.status !== 1) {
      throw new Error(data.msg || "Booking failed");
    }

    return data; // ✅ IMPORTANT

  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Booking failed";

    notify(errorMessage, 0);
    throw error; // ✅ stop sequence
  }
};


  // Handle payment option selection
  const handlePaymentLater = async () => {
  try {
setLoading(true)

    for (const item of slotBookingPayload) {
      await apiHandler(item); // waits for each response
    }
   

  } catch (error) {
    console.error("Booking stopped:", error);
    // step will NOT change
  }
  finally {
  setLoading(false)
}
};


  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [price] = useState(5000); // Static price for ad slot in INR
  const [clientSecret, setClientSecret] = useState(null);
  const [showStripe, setShowStripe] = useState(false);

  const [currency] = useState("USD"); 
  const [ Booking_id]= useState("6942589526e2ad55930564cd"); 



  const  [PayloadData, setPayloadData] = useState({
      
        booking_id: bookingData.booking_id,
        metadata: {
          slot_id: bookingData.slot_id,
          screen_id: bookingData.screen_id,
          booking_type: "ad_slot"
        }
      });
  
  const navigate = useNavigate();

  /* ================= STRIPE PAYMENT FOR AD SLOT ================= */
  const handleStripePayment = async () => {
    try {
      setLoading(true);


      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}stripe/create-payment-intent/${Booking_id}`,
     
      
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Stripe Response:", res.data);

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
    try {

      const loaded = await loadRazorpay();

      if (!loaded) {
        notify("Razorpay SDK failed to load", 0);
        return;
      }

      setLoading(true);
      
      // Static payload for Razorpay


     

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorcreateorder/${Booking_id}`,
        
      );

      console.log("Razorpay Order Response:", response.data);

      if (response.data.status !== 1) {
        throw new Error(response.data.msg || "Failed to create order");
      }

      const { order } = response.data;

      console.log(order,"sdbdbdusybu>>>>ydb");
      
      
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
              transactionId:response?.data?.transactionId
            };
            
            const verify = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}razorverifypayment`,
              verifyPayload
            );

            if (verify.data.status === 1) {
              notify("Payment successful! Ad slot booked.", 1);
              
              // Navigate to booking confirmation with transaction ID
              navigate("/booking-confirmation", { 
                state: { 
                  booking_id: bookingData.booking_id,
                  transaction_id: response.data.transactionId,
                  payment_method: "razorpay"
                }
              });
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
        theme: { color: "#3B82F6" }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function(response) {
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
  const handleStripeSuccess = (paymentResult) => {
    if (paymentResult.status === "succeeded") {
      notify("Payment successful! Ad slot booked.", 1);
      navigate("/booking-confirmation", {
        state: {
          booking_id: bookingData.booking_id,
          payment_method: "stripe",
          payment_intent_id: paymentResult.paymentIntentId
        }
      });
    }
  };

  /* ================= UI RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - AD SLOT DETAILS */}
        <div className="lg:col-span-2 space-y-6">
       

          {/* PAYMENT METHOD SELECTION */}
          
            <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>

            <div className="space-y-3">

              
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-blue-600"
                />
                <SiRazorpay className="text-blue-600 text-2xl" />
                <div className="flex-1">
                  <div className="font-bold text-sm">Razorpay</div>
                  <div className="text-[13px] text-gray-500">Pay with UPI, Cards, Net Banking (India)</div>
                </div>
              
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-purple-600"
                />
                <FaStripe className="text-purple-600 text-2xl" />
                <div>
                  <div className="font-bold text-sm">Stripe</div>
                  <div className="text-[13px] text-gray-500">International Cards & Google/Apple Pay</div>
                </div>
              </label>
            </div>

          


        </div>

  
      </div>
      <div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-blue-600 mt-1 hover:bg-blue-700 text-white px-3 py-1 rounded-lg disabled:opacity-50 flex items-center gap-2  justify-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                `Pay Now`
              )}
            </button>


            <button
              onClick={handlePaymentLater}
              disabled={loading}
              className="bg-green-600 mt-1 hover:bg-green-700 text-white px-3 py-1 rounded-lg disabled:opacity-50 flex items-center gap-2  justify-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                `Pay Later`
              )}
            </button>
        
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
          onSuccess={handleStripeSuccess}
        />
      )}
    </div>
  );
}