import React, { useContext } from "react";
import { Context } from "../Context_holder";
import { useNavigate } from "react-router-dom";

// Icons
import { FaWallet, FaRegCalendarCheck } from "react-icons/fa";
import { SiGoogleads } from "react-icons/si";
import { MdTrendingUp, MdAttachMoney } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { useEffect } from "react";
import { useState } from "react";
// 
const DashboardOverview = () => {
  const { user ,FetchApi,usertoken,getCurrencySymbol} = useContext(Context);
  const navigate = useNavigate();
  const userRole = user?.role || "advertiser";
  const [wallet,setwallet]=useState(null)

  // ============================
  // ⭐ ROLE-BASED DASHBOARD DATA
  // ============================
  const stats = userRole === "screen_owner"
    ? [
        {
          title: "Total Screens",
          value: "12",
          icon: <TbDeviceDesktopAnalytics size={26} />,
          color: "bg-purple-100 text-purple-700",
        },
        {
          title: "Active Ads",
          value: "08",
          icon: <SiGoogleads size={26} />,
          color: "bg-indigo-100 text-indigo-700",
        },
        {
          title: "Earnings",
          value: "₹12,450",
          icon: <GiReceiveMoney size={26} />,
          color: "bg-green-100 text-green-700",
        },
        {
          title: "Wallet Balance",
          value: "₹2,300",
          icon: <FaWallet size={26} />,
          color: "bg-yellow-100 text-yellow-700",
        },
      ]
    : [
        {
          title: "Total Campaigns",
          value: "15",
          icon: <SiGoogleads size={26} />,
          color: "bg-blue-100 text-blue-700",
        },
        {
          title: "Active Screens",
          value: "32",
          icon: <TbDeviceDesktopAnalytics size={26} />,
          color: "bg-indigo-100 text-indigo-700",
        },
        {
          title: "Ad Spent",
          value: "₹5,400",
          icon: <MdAttachMoney size={26} />,
          color: "bg-red-100 text-red-700",
        },
        {
          title: "Wallet Balance",
          value: "₹1,150",
          icon: <FaWallet size={26} />,
          color: "bg-yellow-100 text-yellow-700",
        },
      ];

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





  const transactions = [
    {
      label: "Campaign Payment",
      amount: "-₹1,500",
      date: "12 Dec 2025",
      status: "Completed",
      color: "text-red-600",
    },
    {
      label: "Screen Earning",
      amount: "+₹780",
      date: "11 Dec 2025",
      status: "Received",
      color: "text-green-600",
    },
    {
      label: "Wallet Top-up",
      amount: "+₹500",
      date: "10 Dec 2025",
      status: "Success",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===========================================
      ⭐ WELCOME HEADER
      ============================================ */}
      <div
        className={`bg-gradient-to-r rounded-xl p-6 text-white shadow-md ${
          userRole === "screen_owner"
            ? "from-purple-500 to-indigo-600"
            : "from-blue-500 to-teal-600"
        }`}
      >
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-white/90 mt-1">
          Manage your screens, ads, and wallet easily.
        </p>
      </div>

      {/* ===========================================
      ⭐ STATS GRID
      ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
              {item.icon}
            </div>
            <p className="text-sm text-gray-500">{item.title}</p>
            <h3 className="text-xl font-bold">{item.value}</h3>
          </div>
        ))}

         <div
           
            className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-yellow-100 text-yellow-700`}>
             <FaWallet size={26} />
            </div>
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <h3 className="text-xl font-bold">{ getCurrencySymbol( wallet?.currency)} {wallet?.walletBalance}</h3>
          </div>
      </div>

      {/* ===========================================
      ⭐ CHART / GROWTH SECTION
      ============================================ */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Growth Overview</h3>
          <MdTrendingUp className="text-green-600" size={28} />
        </div>
        <p className="text-gray-600 text-sm">
          Your performance has increased 18% this month.
        </p>
      </div>

      {/* ===========================================
      ⭐ RECENT TRANSACTIONS
      ============================================ */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>

        <div className="space-y-3">
          {transactions.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{t.label}</p>
                <p className="text-sm text-gray-500">{t.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.color}`}>{t.amount}</p>
                <p className="text-xs text-gray-400">{t.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===========================================
      ⭐ ACTION BUTTONS
      ============================================ */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/userprofile/wallet")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Manage Wallet
        </button>

        {userRole === "advertiser" && (
          <button
            onClick={() => navigate("/userprofile/upload")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Upload Ad
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
