import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Verify payment with your backend
      verifyPayment(sessionId);
    } else {
      setStatus('error');
      setMessage('No session ID found');
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PAYMENT_URL}stripe/verify-payment`,
        { sessionId }
      );

      if (res.data.status === 1) {
        setStatus('success');
        setMessage('Payment successful!');
        // Redirect to order success page after 2 seconds
        setTimeout(() => {
          navigate('/order-success');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(res.data.msg || 'Payment verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.msg || 'Payment verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to order page...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
