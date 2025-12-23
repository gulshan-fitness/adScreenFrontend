import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaDownload, 
  FaShareAlt, 
  FaPrint, 
  FaCreditCard,
  FaCalendarAlt,
  FaUser,
  FaLock,
  FaShieldAlt,
  FaChevronRight,
  FaStar,
  FaRegCopy
} from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';

const PaymentSuccess = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const paymentDetails = {
    amount: '$149.99',
    date: 'Dec 15, 2023 • 14:30',
    transactionId: 'TXN-7890-4567-1234',
    cardNumber: '**** **** **** 4242',
    orderId: 'ORD-2023-789456',
    customerName: 'Alex Johnson',
    plan: 'Premium Annual',
    status: 'Completed',
    nextBilling: 'Dec 15, 2024'
  };

  const features = [
    { icon: <FaShieldAlt />, text: 'Advanced Security' },
    { icon: <FaDownload />, text: 'Unlimited Downloads' },
    { icon: <FaStar />, text: 'Priority Support' },
    { icon: <FaLock />, text: 'Ad-Free Experience' }
  ];

  const actions = [
    { icon: <FaDownload />, label: 'Download Invoice', color: 'from-blue-500 to-cyan-500' },
    { icon: <FaShareAlt />, label: 'Share Receipt', color: 'from-purple-500 to-pink-500' },
    { icon: <FaPrint />, label: 'Print', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="relative pt-8 px-6">
            <button className="absolute top-8 left-6 text-gray-400 hover:text-gray-600 transition-colors">
              <BsArrowLeft size={20} />
            </button>
            <div className="text-center">
              {/* Animated Checkmark */}
              <div className={`relative mx-auto w-24 h-24 mb-4 ${isAnimating ? 'scale-110' : 'scale-100'} transition-transform duration-500`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-20"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white" size={48} />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-500 mb-6">
                Your premium subscription is now active
              </p>
              
              {/* Amount Display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  {paymentDetails.amount}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total Paid</div>
              </div>
            </div>
          </div>

          {/* Confetti Effect */}
          <div className="h-1 bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300"></div>

          {/* Details Section */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-emerald-500" />
              Payment Details
            </h2>
            
            <div className="space-y-4">
              {[
                { icon: <FaUser />, label: 'Customer', value: paymentDetails.customerName },
                { icon: <FaCreditCard />, label: 'Payment Method', value: paymentDetails.cardNumber },
                { icon: <FaCalendarAlt />, label: 'Date & Time', value: paymentDetails.date },
                { icon: <FaShieldAlt />, label: 'Plan', value: paymentDetails.plan }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="text-emerald-500 mr-3">{item.icon}</div>
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
              
              {/* Transaction ID with Copy */}
              <div className="bg-gray-50 rounded-xl p-4 mt-4">
                <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-gray-800">{paymentDetails.transactionId}</code>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.transactionId)}
                    className={`flex items-center text-sm ${isCopied ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-500'}`}
                  >
                    <FaRegCopy className="mr-1" />
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Next Billing */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="flex items-center">
                <FaCalendarAlt className="text-emerald-500 mr-3" />
                <div>
                  <div className="text-sm text-emerald-600 font-medium">Next Billing Date</div>
                  <div className="text-gray-800">{paymentDetails.nextBilling}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="px-6 py-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Premium Features Unlocked</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center bg-white p-3 rounded-xl shadow-sm">
                  <div className="text-emerald-500 mr-2">{feature.icon}</div>
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white transform transition-all hover:scale-105 hover:shadow-lg active:scale-95`}
                >
                  <div className="mb-2">{action.icon}</div>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
          Continue to Dashboard
          <FaChevronRight className="ml-2" />
        </button>

        {/* Security Note */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center text-gray-400 mb-1">
            <FaLock className="mr-2" size={12} />
            <span className="text-xs">Secured by PCI DSS Compliance</span>
          </div>
          <p className="text-xs text-gray-400">
            A confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;