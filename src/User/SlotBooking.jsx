import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Context } from '../Context_holder';
import LocationSearch from '../ReusedComponents/LocationSearch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SlotBooking = () => {
  const { user, usertoken, FetchApi, getCurrencySymbol, notify } = useContext(Context);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [screensInArea, setScreensInArea] = useState([]);
  const [screenSlots, setScreenSlots] = useState([]);
  const [loading, setLoading] = useState({
    screens: false,
    slots: false,
    booking: false
  });
  const [searchText, setSearchText] = useState("");
  const [address, setAddress] = useState({
    street: "MG Road",
    city: "Jaipur",
    state: "Rajasthan",
    zipCode: "302001",
    country: "India",
    coordinates: [

75.8189817
,
26.9154576]
  });

  const [slotAds, setSlotAds] = useState({});
  const [slotBookingPayload, setSlotBookingPayload] = useState([]);

  // Memoized screen fetching
  useEffect(() => {
    if (!user || !usertoken || !address) return;

    const fetchScreens = async () => {
      setLoading(prev => ({ ...prev, screens: true }));
      try {
        const res = await FetchApi(
          null,
          import.meta.env.VITE_USER_URL,
          "screenlocationwise",
          null,
          address?.coordinates,
          null,
          usertoken
        );
        setScreensInArea(res || []);
      } catch (err) {
        setScreensInArea([]);
        notify?.('Failed to load screens', 0);
      } finally {
        setLoading(prev => ({ ...prev, screens: false }));
      }
    };

    fetchScreens();
  }, [user, usertoken, address, notify, FetchApi]);

  // Optimized booking payload calculation
  useEffect(() => {
    if (selectedSlots.length === 0) {
      setSlotBookingPayload([]);
      return;
    }

    const payload = selectedSlots.map(slot => ({
      slot_id: slot._id,
      screen_id: selectedScreen?._id,
      advertiser_id: user?._id,
      start_datetime: slot.start_datetime,
      end_datetime: slot.end_datetime,
      duration_minutes: slot.duration_minutes,
      price: slot.price,
      adfiles: slotAds?.[slot._id]?.files || [],
      qrcode: "",
      redirectlink: slotAds?.[slot._id]?.redirectLink || "",
      currency: slot.currency || "INR",
      booking_status: "pending",
      payment_status: "pending"
    }));

    setSlotBookingPayload(payload);
  }, [selectedSlots, slotAds, selectedScreen, user]);

  // Handle screen selection
  const handleScreenSelect = useCallback(async (screen) => {
    setSelectedScreen(screen);
    setLoading(prev => ({ ...prev, slots: true }));
    
    try {
      const res = await FetchApi(
        null,
        import.meta.env.VITE_USER_URL,
        "getscreenslot",
        screen?._id,
        null,
        null,
        usertoken
      );
      setScreenSlots(res || []);
    } catch (err) {
      setScreenSlots([]);
      notify?.('Failed to load slots', 0);
    } finally {
      setLoading(prev => ({ ...prev, slots: false }));
      setStep(2);
    }
  }, [FetchApi, usertoken, notify]);

  // Handle slot selection
  const handleSlotSelect = useCallback((slot) => {
    if (slot?.status !== 'available') return;
    
    const isSelected = selectedSlots.some(s => s?._id === slot?._id);
    
    if (isSelected) {
      // Deselect slot
      setSelectedSlots(prev => prev.filter(s => s?._id !== slot?._id));
      setSlotAds(prev => {
        const newSlotAds = { ...prev };
        delete newSlotAds[slot?._id];
        return newSlotAds;
      });
    } else {
      // Select slot
      setSelectedSlots(prev => [...prev, slot]);
      setSlotAds(prev => ({
        ...prev,
        [slot?._id]: {
          files: [],
          redirectLink: ''
        }
      }));
    }
  }, [selectedSlots]);

  // File upload handler
  const handleFileUpload = useCallback((slotId, files) => {
    setSlotAds(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        files: Array.from(files || [])
      }
    }));
  }, []);

  // Redirect link handler
  const handleRedirectLinkChange = useCallback((slotId, link) => {
    setSlotAds(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        redirectLink: link || ''
      }
    }));
  }, []);

  // Remove file handler
  const handleRemoveFile = useCallback((slotId, fileIndex) => {
    setSlotAds(prev => {
      const currentSlot = prev[slotId];
      if (!currentSlot?.files) return prev;
      
      return {
        ...prev,
        [slotId]: {
          ...currentSlot,
          files: currentSlot.files.filter((_, index) => index !== fileIndex)
        }
      };
    });
  }, []);

  // API handler for bookings
  const apiHandler = useCallback(async (payload) => {
    if (!usertoken) throw new Error("Unauthorized");
    
    const formData = new FormData();

    if (payload?.adfiles?.length > 0) {
      payload.adfiles.forEach(item => {
        formData.append("file", item);
      });
    }

    const { adfiles, ...rest } = payload;
    formData.append("data", JSON.stringify(rest));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}createBooking`,
        formData,
        { headers: { Authorization: usertoken } }
      );

      const { data } = response;
      notify(data.msg, data.status);

      if (data.status !== 1) {
        throw new Error(data.msg || "Booking failed");
      }

      return data;


    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Booking failed";
      notify(errorMessage, 0);
      throw error;
    }
  }, [usertoken, notify]);

  // Handle payment/booking
  const handlePaymentLater = useCallback(async () => {
    if (slotBookingPayload?.length === 0) return;

    setLoading(prev => ({ ...prev, booking: true }));
    try {
      for (const item of slotBookingPayload) {
        await apiHandler(item);
      }
      // Reset on success
      resetBooking();
      
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  }, [slotBookingPayload, apiHandler, navigate]);

  // Utility functions
  const formatTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return '--:--';
    return new Date(dateTimeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }, []);

  const formatDate = useCallback((dateTimeString) => {
    if (!dateTimeString) return 'Select Date';
    return new Date(dateTimeString).toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }, []);

  const calculateTotal = useMemo(() => {
    return selectedSlots.reduce((sum, slot) => sum + (slot?.price || 0), 0);
  }, [selectedSlots]);

  // Reset function
  const resetBooking = useCallback(() => {
    setStep(1);
    setSelectedScreen(null);
    setSelectedSlots([]);
    setScreenSlots([]);
    setSlotAds({});
    setSlotBookingPayload([]);
  }, []);

  // Go back handler
  const goBack = useCallback(() => {
    if (step > 1) setStep(prev => prev - 1);
  }, [step]);

  // Progress steps data
  const steps = [
    { number: 1, label: 'Choose Screen' },
    { number: 2, label: 'Pick Slots' },
    { number: 3, label: 'Upload Ad' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Digital Screen Advertising
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Book advertising slots on premium digital screens
          </p>
        </header>

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between mb-4">
            {steps.map(({ number, label }) => (
              <div key={number} className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base
                  ${step >= number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                  transition-colors duration-300
                `}>
                  {number}
                </div>
                <span className="mt-2 text-xs text-center text-gray-600 px-2">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {step > 1 && (
          <button
            onClick={goBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {/* Step 1: Screen Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="mb-6">
              <LocationSearch
                value={searchText}
                onChange={setSearchText}
                containerClass="relative"
                inputClass="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onSelect={(location) => {
                  setAddress({
                    street: location?.street || '',
                    city: location?.city || '',
                    state: location?.state || '',
                    zipCode: location?.zipCode || '',
                    country: location?.country || '',
                    coordinates: [location?.coordinates?.lng || 0, location?.coordinates?.lat || 0]
                  });
                }}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Screens in {address?.city || 'Your Location'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {screensInArea?.length || 0} screens found
                </p>
              </div>
            </div>

            {loading.screens ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading screens...</p>
              </div>
            ) : screensInArea?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No screens available
                </h3>
                <p className="text-gray-600 mb-4">
                  Try another location or check back later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {

                screensInArea?.map((screen) => (



                  
                <div
  key={screen._id}
  onClick={() => handleScreenSelect(screen)}
  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.98]"
>
  {/* Image Section */}
  <div className="relative">
    <img
      src={screen?.image || '/api/placeholder/400/240'}
      alt={screen?.screenName || 'Digital Screen'}
      className="w-full h-40 sm:h-48 object-cover"
    />
    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-sm">
      <span className="text-xs sm:text-sm font-semibold text-gray-800">
        ⭐ {screen.rating?.toFixed(1) || 'New'}
      </span>
    </div>
  </div>
  
  {/* Content Section */}
  <div className="p-4 sm:p-5">
    {/* Header with Title and Status */}
    <div className="flex justify-between items-start mb-3 gap-2">
      <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
        {screen.screenName}
      </h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
        screen.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {screen.status ? 'Active' : 'Offline'}
      </span>
    </div>
    
    {/* Screen Type and Location Badges */}
    <div className="flex flex-wrap gap-1.5 mb-3">
      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded capitalize">
        {screen.screenType || 'LCD'}
      </span>
      <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded capitalize">
        {screen.locationType?.replace('_', ' ') || 'Public Space'}
      </span>
      <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded">
        {screen.orientation === 'portrait' ? '📱 Portrait' : '🖥️ Landscape'}
      </span>
    </div>
    
    {/* Screen Specifications Grid */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="space-y-1.5">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span className="w-5 text-gray-500">📐</span>
          <span className="font-medium text-gray-800">{screen.size?.diagonal || 'N/A'}"</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span className="w-5 text-gray-500">🖼️</span>
          <span className="font-medium text-gray-800">
            {screen.resolution?.width || 'N/A'}×{screen.resolution?.height || 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span className="w-5 text-gray-500">📍</span>
          <span className="truncate font-medium text-gray-800">
            {screen.address?.city || 'Location'}
          </span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span className="w-5 text-gray-500">📁</span>
          <span className="font-medium text-gray-800">
            {screen.supportedFormats?.length || 0} formats
          </span>
        </div>
      </div>
    </div>
    
    {/* Detailed Address (Hidden on mobile, shown on tablet+) */}
    <div className="hidden sm:block mb-4">
      <div className="flex items-start text-xs text-gray-500">
        <span className="mt-0.5 mr-2">📍</span>
        <span className="line-clamp-2">
          {screen.address?.street || 'Address not specified'}, {screen.address?.city}, {screen.address?.state}
        </span>
      </div>
    </div>
    
    {/* Supported Formats (Collapsible on mobile) */}
    <div className="mb-4">
      <details className="group sm:hidden">
        <summary className="flex items-center text-xs text-gray-600 cursor-pointer list-none">
          <span className="mr-1">📁</span>
          <span className="font-medium">Supported Formats</span>
          <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-2 flex flex-wrap gap-1">
          {screen.supportedFormats?.map((format, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {format.toUpperCase()}
            </span>
          )) || <span className="text-xs text-gray-500">No formats specified</span>}
        </div>
      </details>
      
      {/* Always visible on larger screens */}
      <div className="hidden sm:flex flex-wrap gap-1">
        {screen.supportedFormats?.slice(0, 3).map((format, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {format.toUpperCase()}
          </span>
        ))}
        {screen.supportedFormats?.length > 3 && (
          <span className="text-xs text-gray-500">+{screen.supportedFormats.length - 3} more</span>
        )}
      </div>
    </div>
    
    {/* Action Button */}
    <div className="pt-4 border-t border-gray-100">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleScreenSelect(screen);
        }}
        className="w-full bg-blue-600 text-white text-sm sm:text-base font-medium py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Select Screen
      </button>
    </div>
  </div>
</div>


                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Slot Selection */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Available Time Slots
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedScreen?.name}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change Screen
                </button>
                <button
                  onClick={resetBooking}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Change Location
                </button>
              </div>
            </div>

            {/* Screen Info */}
         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 mb-6 border border-blue-200 shadow-sm">
  <div className="flex items-start gap-3 sm:gap-4">
    {/* Screen Image */}
    <div className="relative flex-shrink-0">
      <img
        src={selectedScreen?.image || '/api/placeholder/96/96'}
        alt={selectedScreen?.screenName || 'Digital Screen'}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white shadow"
      />
      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
        ✓
      </div>
    </div>
    
    {/* Screen Info */}
    <div className="flex-1 min-w-0">
      {/* Title and Status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-800 text-lg sm:text-xl truncate">
            {selectedScreen?.screenName || 'Selected Screen'}
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="truncate">
                {selectedScreen?.address?.city || 'Location'}, {selectedScreen?.address?.state || 'State'}
              </span>
            </span>
          </div>
        </div>
        
        {/* Status Badge - Mobile & Desktop */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            selectedScreen?.status 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {selectedScreen?.status ? 'Active' : 'Offline'}
          </span>
          <span className="hidden sm:inline-flex items-center bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
            ⭐ {selectedScreen?.rating?.toFixed(1) || 'New'}
          </span>
        </div>
      </div>
      
      {/* Mobile Rating */}
      <div className="sm:hidden flex items-center mb-2">
        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
          ⭐ {selectedScreen?.rating?.toFixed(1) || 'New'}
        </span>
      </div>
      
      {/* Screen Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3">
        <div className="bg-white/80 rounded-lg p-2 sm:p-3 border border-blue-100">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span className="mr-1">📐</span>
            Size
          </div>
          <div className="font-semibold text-gray-800 text-sm">
            {selectedScreen?.size?.diagonal || 'N/A'}"
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-2 sm:p-3 border border-blue-100">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span className="mr-1">🖥️</span>
            Resolution
          </div>
          <div className="font-semibold text-gray-800 text-sm">
            {selectedScreen?.resolution?.width || 'N/A'}×{selectedScreen?.resolution?.height || 'N/A'}
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-2 sm:p-3 border border-blue-100">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span className="mr-1">📱</span>
            Orientation
          </div>
          <div className="font-semibold text-gray-800 text-sm capitalize">
            {selectedScreen?.orientation || 'N/A'}
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-2 sm:p-3 border border-blue-100">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span className="mr-1">🏷️</span>
            Type
          </div>
          <div className="font-semibold text-gray-800 text-sm capitalize">
            {selectedScreen?.screenType || 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Additional Info - Only on larger screens */}
      <div className="hidden sm:flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="mr-1">📍</span>
          <span className="truncate max-w-[200px]">
            {selectedScreen?.address?.street || 'Address not specified'}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">📁</span>
          <span>
            {selectedScreen?.supportedFormats?.length || 0} supported formats
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">🏢</span>
          <span className="capitalize">
            {selectedScreen?.locationType?.replace('_', ' ') || 'Public Space'}
          </span>
        </div>
      </div>
      
      {/* Mobile View Additional Info (Collapsible) */}
      <details className="group sm:hidden mt-2">
        <summary className="flex items-center text-xs text-blue-600 font-medium cursor-pointer list-none">
          <span>View more details</span>
          <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <span className="w-6">📍</span>
            <span className="truncate">
              {selectedScreen?.address?.street || 'Address not specified'}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <span className="w-6">📁</span>
            <span>
              Supports: {selectedScreen?.supportedFormats?.map(f => f.toUpperCase()).join(', ') || 'N/A'}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <span className="w-6">🏢</span>
            <span className="capitalize">
              Location: {selectedScreen?.locationType?.replace('_', ' ') || 'Public Space'}
            </span>
          </div>
        </div>
      </details>
    </div>
  </div>
</div>

            {/* Slot Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                {screenSlots?.[0]?.start_datetime ? formatDate(screenSlots[0].start_datetime) : 'Available Slots'}
              </h3>
              
              {loading.slots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading slots...</p>
                </div>
              ) : screenSlots?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <div className="text-3xl mb-3">📅</div>
                  <p className="text-gray-600">No slots available for this screen</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {screenSlots?.map((slot) => {
  const isSelected = selectedSlots.some(s => s._id === slot._id);
  const isAvailable = slot.status === "available";

  return (
    <button
      key={slot._id}
      onClick={() => isAvailable && handleSlotSelect(slot)}
      disabled={!isAvailable}
      className={`
        p-4 rounded-lg border text-center transition-all duration-200
        ${
          isSelected && isAvailable
            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
            : isAvailable
              ? "bg-white hover:bg-blue-50 border-gray-200 cursor-pointer"
              : "bg-gray-100 border-gray-300 opacity-40 cursor-not-allowed"
        }
      `}
    >
      {/* Time */}
      <div className="font-medium text-sm">
        {formatTime(slot.start_datetime)}
      </div>

      {/* Status */}
      <div className="text-xs mt-1">
        {isAvailable ? "Available" : slot.status}
      </div>

      {/* Price */}
      <div
        className={`mt-2 font-semibold text-sm ${
          isAvailable
            ? isSelected
              ? "text-blue-100"
              : "text-blue-600"
            : "text-gray-400"
        }`}
      >
        {getCurrencySymbol?.(slot.currency || "INR")}
        {slot.price}
      </div>
    </button>
  );
})}

                </div>
              )}
            </div>

            {/* Selected Slots Summary */}
            {selectedSlots.length > 0 && (
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Selected Slots ({selectedSlots.length})
                  </h3>
                  <div className="font-bold text-xl text-gray-800">
                    Total: {getCurrencySymbol?.(selectedSlots[0]?.currency || 'INR')}{calculateTotal}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {selectedSlots.map((slot) => (
                    <div key={slot._id} className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                      <span className="font-medium">
                        {formatTime(slot.start_datetime)} - {formatTime(slot.end_datetime)}
                      </span>
                      <span className="font-semibold text-green-700">
                        {getCurrencySymbol?.(slot.currency || 'INR')}{slot.price}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => setStep(3)}
                    className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                    disabled={loading.booking}
                  >
                    {loading.booking ? 'Processing...' : 'Proceed to Upload Ads'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Upload Ads */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Upload Advertisement Content
              </h2>
              <p className="text-gray-600 text-sm">
                Add files and redirect links for each selected slot
              </p>
            </div>

            {/* Screen Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedScreen?.image || '/api/placeholder/64/48'}
                  alt={selectedScreen?.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{selectedScreen?.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected • 
                    Total: {getCurrencySymbol?.(selectedSlots[0]?.currency || 'INR')}{calculateTotal}
                  </p>
                </div>
              </div>
            </div>

            {/* Supported Formats Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Supported Formats</p>
                  <p className="text-yellow-700 text-sm">
                    {(selectedScreen?.supportedFormats?.join(', ')?.toUpperCase() || 'MP4, JPG, PNG')} • 
                    Max file size: {selectedScreen?.maxFileSize || 100}MB
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Sections */}
            <div className="space-y-6">
              {selectedSlots.map((slot, index) => (
                <div key={slot._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Slot {index + 1}: {formatTime(slot.start_datetime)} - {formatTime(slot.end_datetime)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(slot.start_datetime)} • {slot.duration_minutes} minutes
                      </p>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {getCurrencySymbol?.(slot.currency || 'INR')}{slot.price}
                    </span>
                  </div>

                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id={`file-upload-${slot._id}`}
                        multiple
                        accept={selectedScreen?.supportedFormats?.map(format => `.${format}`)?.join(',') || ".mp4,.jpg,.png"}
                        className="hidden"
                        onChange={(e) => handleFileUpload(slot._id, e.target.files)}
                      />
                      <label
                        htmlFor={`file-upload-${slot._id}`}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedScreen?.supportedFormats?.join(', ')?.toUpperCase() || 'MP4, JPG, PNG')} up to {selectedScreen?.maxFileSize || 100}MB
                        </p>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {slotAds[slot._id]?.files?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {slotAds[slot._id].files.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center truncate">
                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(slot._id, fileIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Redirect Link */}
                  <div>
                    <label htmlFor={`redirect-link-${slot._id}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Redirect Link (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        id={`redirect-link-${slot._id}`}
                        value={slotAds[slot._id]?.redirectLink || ''}
                        onChange={(e) => handleRedirectLinkChange(slot._id, e.target.value)}
                        placeholder="https://example.com/your-landing-page"
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      QR code will be generated automatically
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to Slots
              </button>
              <button
                onClick={handlePaymentLater}
                disabled={loading.booking}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.booking ? 'Processing...' : 'Complete Booking →'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Digital Screen Advertising Platform. All rights reserved.</p>
            <p className="mt-2">Need help? Contact support@adscreens.com</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SlotBooking;