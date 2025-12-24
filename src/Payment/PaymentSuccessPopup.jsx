import React, { useState, useEffect, useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Context } from "../Context_holder";

const PaymentSuccessPopup = () => {
  const { PaymentSuccessPopUp, setPaymentSuccessPopUp, PaymentSuccesdData, getCurrencySymbol } = useContext(Context);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Handle open animation
  useEffect(() => {
    if (PaymentSuccessPopUp) {
      setIsAnimating(true);
      setIsClosing(false);
      const timer = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timer);
    }
  }, [PaymentSuccessPopUp]);

  // Handle auto-close after 2 seconds
  useEffect(() => {
    let closeTimer;
    
    if (PaymentSuccessPopUp && !isClosing) {
      closeTimer = setTimeout(() => {
        setIsClosing(true);
        
        // Close after fade out animation
        setTimeout(() => {
          setPaymentSuccessPopUp(false);
          setIsClosing(false);
        }, 300);
      }, 5000);
    }

    return () => {
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [PaymentSuccessPopUp, isClosing, setPaymentSuccessPopUp]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setPaymentSuccessPopUp(false);
      setIsClosing(false);
    }, 300);
  };

  if (!PaymentSuccessPopUp) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
        ${isClosing ? "bg-black/0" : "bg-black/70"}
      `}
    >
      {/* Modal with modern glass effect */}
      <div
        className={`
          relative
          w-full max-w-sm sm:max-w-md mx-4
          bg-white/95 backdrop-blur-xl
          rounded-2xl sm:rounded-3xl
          p-6 sm:p-8
          shadow-2xl
          border border-white/20
          transition-all duration-300 ease-out
          ${isClosing ? "scale-90 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"}
          ${isAnimating ? "scale-95 opacity-0 translate-y-4" : ""}
        `}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100/80 
                   transition-all duration-200 group z-10"
        >
          <IoClose 
            size={22} 
            className="text-gray-500 group-hover:text-gray-800 transition-colors" 
          />
        </button>

        {/* Progress bar for auto-close timing */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-2000 ease-linear"
            style={{
              width: isClosing ? '100%' : '0%',
              transition: isClosing ? 'width 0.3s ease-out' : 'width 2s linear'
            }}
          />
        </div>

        <div className="text-center">
          {/* Modern animated check */}
          <div
            className={`relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 transition-all duration-700 
              ${isAnimating ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
          >
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-green-500/40 rounded-full animate-pulse"></div>
            
            {/* Animated ring */}
            <div 
              className="absolute inset-0 border-4 border-transparent rounded-full"
              style={{
                borderImage: 'linear-gradient(135deg, #34d399, #10b981) 1',
                animation: 'spin 1s linear infinite'
              }}
            />
            
            {/* Main check circle */}
            <div className="absolute inset-2 bg-gradient-to-br from-emerald-50 to-white rounded-full 
                          flex items-center justify-center shadow-lg border border-emerald-100">
              <div className="relative">
                <FaCheckCircle className="text-emerald-500 text-5xl sm:text-6xl drop-shadow-sm" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-sm"></div>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300/30 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400/30 rounded-full animate-bounce delay-300"></div>
          </div>

          {/* Title */}
          <h1
            className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 
                       bg-clip-text text-transparent mb-3 transition-all duration-500 delay-200
                       ${isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
          >
            Payment Successful!
          </h1>
          
          {/* Subtitle */}
          <p className={`text-gray-500 mb-6 transition-all duration-500 delay-300
                        ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            Thank you for your purchase
          </p>

          {/* Amount Card */}
          <div
            className={`transition-all duration-700 delay-400
                       ${isAnimating ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
          >
            <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white 
                          border border-emerald-100/50 shadow-lg">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 
                            bg-clip-text text-transparent flex items-center justify-center gap-1">
                <span className="text-2xl">{getCurrencySymbol(PaymentSuccesdData?.currency)}</span>
                <span>{PaymentSuccesdData?.price}</span>
              </div>
              <div className="text-xs font-medium text-gray-400 mt-2 tracking-wider uppercase">
                Total Paid
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className={`mt-6 pt-6 border-t border-gray-100 transition-all duration-500 delay-600
                         ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 
                      bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 
                      rounded-full blur-sm"></div>
      </div>

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPopup;