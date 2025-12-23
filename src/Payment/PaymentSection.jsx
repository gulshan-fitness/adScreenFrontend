import React, { useContext } from 'react'
import AdSlotPayment from './AdSlotPayment'
import { Context } from '../Context_holder'

export default function PaymentSection({slotBookingPayload}) {
    const {}=useContext(Context)
  return (
   <div className="max-w-lg mx-auto px-2 sm:px-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full mb-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 112-2 2 2 0 01-2 2zm8-2a2 2 0 112-2 2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Payment</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Select payment method</p>
                </div>
  
                {/* Order Summary Mini */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{selectedScreen?.name || 'Screen'}</p>
                    <p className="text-xs text-gray-600">{selectedSlots?.length || 0} slot{selectedSlots?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-base sm:text-lg font-bold text-green-600">{getCurrencySymbol?.(selectedSlots?.[0]?.currency || 'INR')}{calculateTotal()}</p>
                  </div>
                </div>
  
                {/* Payment Buttons */}
                <div className="space-y-2 sm:space-y-3 mb-4">
            
                 
                    
  
  <AdSlotPayment  slotBookingPayload={slotBookingPayload}/>
  
                    
                  
                  
  
               
                </div>
  
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 sm:py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors active:scale-[0.98] text-xs sm:text-sm"
                  >
                    ← Back
                  </button>
                  <div className="text-center text-xs text-gray-500 py-2 px-1 sm:px-2 hidden sm:block">
                    Secure<br/>payment
                  </div>
                  <div className="text-center text-xs text-gray-500 py-2 px-1 sm:hidden">
                    Secure
                  </div>
                </div>
              </div>
            </div>
  )
}
