import React, { useContext } from 'react';
import { Context } from '../Context_holder';
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaWallet } from 'react-icons/fa';

const Wallet = () => {
  const { user } = useContext(Context);
  const userData = user;
  const userRole = userData?.role || 'advertiser';

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className={`bg-gradient-to-r rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white ${
        userRole === 'screen_owner' 
          ? 'from-purple-500 to-indigo-600' 
          : 'from-blue-500 to-teal-600'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm lg:text-base">
              {userRole === 'screen_owner' ? 'Total Earnings' : 'Current Balance'}
            </p>
            <p className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2">
              ₹{userData?.walletBalance?.toLocaleString() || '0.00'}
            </p>
            <p className="text-white/80 mt-1 lg:mt-2 text-sm lg:text-base">
              {userRole === 'screen_owner' 
                ? 'Available for withdrawal' 
                : 'Available for campaigns and bookings'}
            </p>
          </div>
          <div className="p-3 lg:p-4 bg-white/20 rounded-lg lg:rounded-xl">
            <FaWallet className="text-2xl lg:text-3xl" />
          </div>
        </div>
        <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row gap-3">
          {userRole === 'screen_owner' ? (
            <>
              <button className="bg-white text-purple-600 font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-purple-50 transition text-sm lg:text-base w-full sm:w-auto">
                Withdraw Earnings
              </button>
              <button className="bg-transparent border border-white text-white font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-white/10 transition text-sm lg:text-base w-full sm:w-auto">
                View Transactions
              </button>
            </>
          ) : (
            <>
              <button className="bg-white text-blue-600 font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-50 transition text-sm lg:text-base w-full sm:w-auto">
                Add Funds
              </button>
              <button className="bg-transparent border border-white text-white font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-white/10 transition text-sm lg:text-base w-full sm:w-auto">
                View History
              </button>
            </>
          )}
        </div>
      </div>
      {/* Add more wallet-specific content here */}
    </div>
  );
};

export default Wallet;