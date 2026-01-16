import React, { useContext } from 'react';
import { Context } from '../Context_holder';
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaWallet } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import BankAccountsList from './BankAccountsList';

const Wallet = () => {
  const { user ,FetchApi,usertoken,getCurrencySymbol } = useContext(Context);
    const [wallet,setwallet]=useState(null)
      const [BanksList,setBanksList]=useState(false)


    useEffect(() => {
      if (!usertoken || !user) return;
    
      const fetchWallet = async () => {
        try {
          const res = await FetchApi(
            null,
            import.meta.env.VITE_USER_URL,
            "getwallete",
            user?._id,
            null,
            null,
            usertoken
          );
          setwallet(res);
        } catch (err) {
          console.error("Error fetching wallet:", err);
        }
      };
    
      fetchWallet();
    }, [user, usertoken]);



  return (
    <div className="space-y-4 lg:space-y-6">
      <div className={`bg-gradient-to-r rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white ${
       'from-purple-500 to-indigo-600' 
        
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm lg:text-base">
              Current Balance
            </p>
            <p className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2">
           { getCurrencySymbol( wallet?.currency)} {wallet?.walletBalance}
            </p>
            <p className="text-white/80 mt-1 lg:mt-2 text-sm lg:text-base">
            
                
            </p>
          </div>
          <div className="p-3 lg:p-4 bg-white/20 rounded-lg lg:rounded-xl">
            <FaWallet className="text-2xl lg:text-3xl" />
          </div>
        </div>
        <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row gap-3">
       
            
              <button className="bg-white text-purple-600 font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-purple-50 transition text-sm lg:text-base w-full sm:w-auto" onClick={()=>setBanksList(true)}>
                Withdraw Earnings
              </button>
              <button className="bg-transparent border border-white text-white font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-white/10 transition text-sm lg:text-base w-full sm:w-auto">
                View Transactions
              </button>
          
          
          
          
        </div>
      </div>


    {BanksList &&(<BankAccountsList/>)

    }


    </div>
  );
};

export default Wallet;