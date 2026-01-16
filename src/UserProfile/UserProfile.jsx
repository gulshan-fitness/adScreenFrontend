import React, { useState, useEffect, useContext } from 'react';
import { 
  FaUser, FaWallet, FaCog, FaBell, FaSearch, FaChartBar, 
  FaShieldAlt, FaSignOutAlt, FaPhone, FaGlobe, FaBars, 
  FaEnvelope, FaIdCard, FaMoneyCheckAlt, FaBuilding,
  FaMapMarkerAlt, FaStore, FaEye, FaClock, FaCalendarAlt,
  FaUpload, FaSearchLocation, FaPlayCircle, FaSignal,
  FaRegCalendarCheck, FaMapMarkedAlt, FaWifi, FaMobileAlt,
  FaRupeeSign, FaHistory, FaCreditCard, FaAd
} from 'react-icons/fa';



import {
  MdDashboard,
  MdPayment,
  MdLocationOn,
  MdBusiness,
  MdAccountBalanceWallet,
  MdNotifications,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdMoreVert,
  MdScreenSearchDesktop,
  MdHistory,
  MdSchedule,
  MdAccountBalance,
  MdPlayCircle,
  MdVisibility,
  MdTrendingUp,
  MdOfflineBolt,
  MdAttachMoney,
  MdScreenShare,
  MdLocationCity,
  MdQrCodeScanner,
  MdAdsClick,
  MdAdd
} from "react-icons/md";

import { SiGoogleads } from "react-icons/si";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { Context } from '../Context_holder';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

const UserProfileDashboard = () => {
  const { user, notify, setuser } = useContext(Context);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userData = user;
  const userRole = userData?.role || 'advertiser';

  // Get active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/userprofile/')) {
      const tab = path.split('/userprofile/')[1] || '';
      return tab || 'overview';
    }
    return 'overview';
  };

  const activeTab = getActiveTab();

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
        setShowMobileMenu(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Role-based navigation items
  const advertiserNavItems = [
    { id: 'overview', label: 'Dashboard', icon: <MdDashboard className="text-xl" />, mobile: true, path: '' },

    { id: 'profile', label: 'Profile', icon: <FaUser className="text-xl" />, mobile: true, path: 'profile' },

    { id: 'search', label: 'Find Screens', icon: <MdScreenSearchDesktop  className="text-xl" />, mobile: true, path: 'findscreens' },


    
    { id: 'search', label: 'Online Screens', icon: <MdScreenSearchDesktop  className="text-xl" />, mobile: true, path: 'onlinescreens' },

    { id: 'campaigns', label: 'My Campaigns', icon: <SiGoogleads className="text-xl" />, mobile: true, path: 'campaigns' },
    { id: 'wallet', label: 'Wallet', icon: <MdAccountBalanceWallet className="text-xl" />, mobile: true, path: 'wallet' },
    { id: 'bookings', label: 'Booking List', icon: <FaRegCalendarCheck className="text-xl" />, mobile: true, path: 'bookinglist' },


    { id: 'upload', label: 'Upload Ads', icon: <FaUpload className="text-xl" />, mobile: false, path: 'upload' },
    { id: 'tracking', label: 'Live Tracking', icon: <MdVisibility className="text-xl" />, mobile: false, path: 'tracking' },
    { id: 'history', label: 'Payment History', icon: <MdHistory className="text-xl" />, mobile: false, path: 'history' },
    { id: 'settings', label: 'Settings', icon: <MdSettings className="text-xl" />, mobile: false, path: 'settings' },
  ];

  const screenOwnerNavItems = [
    { id: 'overview', label: 'Dashboard', icon: <MdDashboard className="text-xl" />, mobile: true, path: '' },
    { id: 'profile', label: 'Profile', icon: <FaUser className="text-xl" />, mobile: true, path: 'profile' },

    { id: 'screens', label: 'My Screens', icon: <MdScreenShare className="text-xl" />, mobile: true, path: '',  subitems: [
      { name: "Add", path: "screens/add", icon: <MdAdd /> },
      { name: "View", path: "screens/view", icon: <MdVisibility /> },
    ], },


     { id: 'playad', label: 'Play AD', icon: <MdScreenShare className="text-xl" />, mobile: true, path: 'playads',   },



    { id: 'slots', label: 'Set Slots', icon: <MdSchedule className="text-xl" />, mobile: true, path: '' ,subitems: [
      { name: "Add", path: "slots/add", icon: <MdAdd /> },
      { name: "View", path: "slots/view", icon: <MdVisibility /> },
    ], },



     { id: 'bookings', label: 'Booking Request', icon: <FaRegCalendarCheck className="text-xl" />, mobile: true, path: 'bookinglist' },


    { id: 'wallet', label: 'Earnings', icon: <MdAccountBalanceWallet className="text-xl" />, mobile: true, path: 'wallet' },
    { id: 'location', label: 'Location Setup', icon: <MdLocationCity className="text-xl" />, mobile: true, path: 'location' },
    { id: 'player', label: 'Screen Player', icon: <MdPlayCircle className="text-xl" />, mobile: false, path: 'player' },
    { id: 'pricing', label: 'Pricing', icon: <MdAttachMoney className="text-xl" />, mobile: false, path: 'pricing' },
    { id: 'analytics', label: 'Analytics', icon: <TbDeviceDesktopAnalytics className="text-xl" />, mobile: false, path: 'analytics' },
    { id: 'settings', label: 'Settings', icon: <MdSettings className="text-xl" />, mobile: false, path: 'settings' },
  ];

  const navItems = userRole === 'screen_owner' ? screenOwnerNavItems : advertiserNavItems;
  const mobileNavItems = navItems.filter(item => item.mobile);

  const handleNavigation = (path) => {
    if (path === '') {
      navigate('/userprofile');
    } else {
      navigate(`/userprofile/${path}`);
    }
    if (isMobile) {
      setSidebarOpen(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('usertoken');
    setuser(null);
    notify('Logged out successfully', 1);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MdMoreVert size={20} />
            </button>
            
            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {navItems.filter((item,) => !item.mobile).map((item,index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm"
                >
                  <MdLogout />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaBell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
            userRole === 'screen_owner' 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
              : 'bg-gradient-to-r from-blue-500 to-teal-600'
          }`}>
            {userData?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex relative">
        {/* Sidebar */}
        <div className={`
          sidebar-container
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-10
          w-72 lg:w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          flex flex-col h-screen lg:h-auto shadow-xl lg:shadow-none
        `}>
          {/* Sidebar Header */}
          <div className="p-5 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  userRole === 'screen_owner'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
                }`}>
                  <span className="text-white font-bold text-lg">
                    {userRole === 'screen_owner' ? 'S' : 'A'}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">AdPlatform</h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {userRole === 'screen_owner' ? 'Screen Dashboard' : 'Advertiser Dashboard'}
                  </p>
                </div>
              </div>
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <MdClose size={20} />
                </button>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-5 lg:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                userRole === 'screen_owner'
                  ? 'bg-gradient-to-r from-purple-400 to-indigo-600'
                  : 'bg-gradient-to-r from-blue-400 to-teal-600'
              }`}>
                {userData?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-sm lg:text-base">{userData?.name}</p>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{userData?.email}</p>
                <p className="text-xs mt-1">
                  <span className={`px-2 py-1 rounded-full ${
                    userRole === 'screen_owner'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {userRole === 'screen_owner' ? 'Screen Owner' : 'Advertiser'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gradient-to-b scrollbar-thumb-from-purple-500 scrollbar-thumb-to-blue-500 scrollbar-track-gray-100">
  <ul className="space-y-2 md:space-y-3">
    {navItems?.map((item,index) => (
      <li key={index} className="group ">
        {/* Main Navigation Item */}
        <button
          onClick={() => (item?.id === "overview" || item?.path) && handleNavigation(item.path)}
          className={`
            w-full   
            px-4 py-3.5 md:py-3 rounded-xl transition-all duration-300
            text-sm md:text-base lg:text-[15px] min-h-[48px] md:min-h-[44px]
            group-hover:shadow-sm group-hover:-translate-y-[2px]
            hover:scale-[1.02] active:scale-[0.98]
            transform-gpu will-change-transform
            ${activeTab === item.id
              ? userRole === 'screen_owner'
                ? 'bg-gradient-to-r from-purple-50 via-purple-50/80 to-purple-50/60 text-purple-700 font-semibold shadow-[0_2px_12px_-2px_rgba(168,85,247,0.15)] border-l-4 border-l-purple-500'
                : 'bg-gradient-to-r from-blue-50 via-blue-50/80 to-blue-50/60 text-blue-700 font-semibold shadow-[0_2px_12px_-2px_rgba(59,130,246,0.15)] border-l-4 border-l-blue-500'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-50/40 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border-l-4 border-l-transparent'
            }
          `}
        >
          <div className="flex items-center space-x-3 md:space-x-4">
            <span className={`
              transition-all duration-300 relative
              ${activeTab === item.id
                ? userRole === 'screen_owner'
                  ? 'text-purple-600 scale-110'
                  : 'text-blue-600 scale-110'
                : 'text-gray-500 group-hover:scale-110 group-hover:text-gray-700'
              }
            `}>
              {item.icon}
              {activeTab === item.id && (
                <span 
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                    backgroundColor: userRole === 'screen_owner' ? '#a855f7' : '#3b82f6',
                    opacity: 0.75
                  }}
                />
              )}
            </span>
            <span className="text-left font-medium tracking-tight">{item.label}</span>
          </div>
          
          {/* Dropdown Indicator */}
          {item?.subitems && item.subitems.length > 0 && (
 <div
 className="
    mt-1
   hidden group-hover:block
   bg-white/95 backdrop-blur-sm
   rounded-2xl shadow-2xl
   px-2 py-1  border border-gray-200/80
   z-50 min-w-[220px]
 "
>

    {/* Sub Items Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {item.subitems.map((subitem, subIndex) => (
        <button
          key={subIndex}
          onClick={() => subitem?.path && handleNavigation(subitem.path)}
          className="
            flex items-center gap-1
            px-1 py-1
            rounded-xl text-sm font-medium
            bg-gradient-to-r from-amber-50 to-amber-100
            border border-amber-200
            text-amber-900
            hover:from-amber-100 hover:to-amber-200
            hover:shadow-lg
            transition-all duration-300
          "
        >
          <span className="text-amber-700">{subitem.icon}</span>
          <span className="flex-1 text-left ">{subitem.name}</span>
        </button>
      ))}
    </div>
  </div>
)}

        </button>

        
      
      </li>
    ))}
  </ul>

  {/* Mobile Bottom Spacing */}
  <div className="h-8 md:hidden" />
</nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition text-sm lg:text-base font-medium"
            >
              <MdLogout size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 lg:pl-8 pb-20 lg:pb-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500">
              Manage your earnings
               
              </p>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Desktop User Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    userRole === 'screen_owner'
                      ? 'bg-gradient-to-r from-purple-400 to-indigo-600'
                      : 'bg-gradient-to-r from-blue-400 to-teal-600'
                  }`}>
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-medium text-sm">{userData?.name}</p>
                    <p className="text-xs text-gray-500">
                      {userRole === 'screen_owner' ? 'Screen Owner' : 'Advertiser'}
                    </p>
                  </div>
                </button>
                
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-30">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-sm">{userData?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm mt-1"
                  >
                    <MdLogout size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Using Outlet */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden overflow-x-auto fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around items-center z-40 shadow-lg">
            {mobileNavItems.map((item,index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all flex-1 ${
                  activeTab === item.id 
                    ? `${
                        userRole === 'screen_owner'
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-blue-600 bg-blue-50'
                      }` 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className={`flex flex-col items-center p-2 rounded-lg flex-1 ${
                activeTab === 'logout' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <MdLogout className="text-xl mb-1" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfileDashboard;