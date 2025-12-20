import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Context_holder';
import LocationSearch from '../ReusedComponents/LocationSearch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdSlotPayment from '../Payment/AdSlotPayment';

const SlotBooking = () => {
  const { user, usertoken, FetchApi, getCurrencySymbol, notify } = useContext(Context);
const Navigater= useNavigate()
  const [step, setStep] = useState(1);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [screensInArea, setScreensInArea] = useState([]);
  const [screenSlots, setScreenSlots] = useState([]);
  const [paymentOption, setPaymentOption] = useState('');
  const [bookingSummary, setBookingSummary] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "MG Road",
    city: "Jaipur",
    state: "Rajasthan",
    zipCode: "302001",
    country: "India",
    coordinates: [74.3829453, 26.4527513]
  });

  // State for ad files and redirect links for each slot
  const [slotAds, setSlotAds] = useState({});
  const [slotBookingPayload, setSlotBookingPayload] = useState([]);

  useEffect(() => {
    if (!user || !usertoken || !address) return;

    setLoading(true);
    FetchApi(null, import.meta.env.VITE_USER_URL, "screenlocationwise", null, address?.coordinates, null, usertoken)
      .then((res) => {
        setScreensInArea(res || []);
        setLoading(false);
      })
      .catch((err) => {
        setScreensInArea([]);
        setLoading(false);
        notify?.('Failed to load screens', 0);
      });
  }, [user, usertoken, address, notify]);

  // Handle screen selection
  const handleScreenSelect = (screen) => {
    setSelectedScreen(screen);
    setLoading(true);
    
    // Get slots for selected screen
    FetchApi(null, import.meta.env.VITE_USER_URL, "getscreenslot", screen?._id, null, null, usertoken)
      .then((res) => {
        setScreenSlots(res || []);
        setLoading(false);
      })
      .catch((err) => {
        setScreenSlots([]);
        setLoading(false);
        notify?.('Failed to load slots', 0);
      });
    
    setStep(2);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (slot?.status !== 'available') return;
    
    if (selectedSlots?.find(s => s?._id === slot?._id)) {
      // Deselect if already selected
      setSelectedSlots(selectedSlots?.filter(s => s?._id !== slot?._id));
      // Remove ad data for deselected slot
      const newSlotAds = { ...slotAds };
      delete newSlotAds[slot?._id];
      setSlotAds(newSlotAds);
    } else {
      // Add to selected slots
      setSelectedSlots([...selectedSlots, slot]);
      // Initialize ad data for new slot
      setSlotAds({
        ...slotAds,
        [slot?._id]: {
          files: [],
          redirectLink: ''
        }
      });
    }
  };

  // Handle file upload for a specific slot
  const handleFileUpload = (slotId, files) => {
    setSlotAds({
      ...slotAds,
      [slotId]: {
        ...slotAds?.[slotId],
        files: Array.from(files || [])
      }
    });
  };

  // Handle redirect link change for a specific slot
  const handleRedirectLinkChange = (slotId, link) => {
    setSlotAds({
      ...slotAds,
      [slotId]: {
        ...slotAds?.[slotId],
        redirectLink: link || ''
      }
    });
  };

  // Remove file from a slot
  const handleRemoveFile = (slotId, fileIndex) => {
    const updatedFiles = [...(slotAds?.[slotId]?.files || [])];
    updatedFiles.splice(fileIndex, 1);
    
    setSlotAds({
      ...slotAds,
      [slotId]: {
        ...slotAds?.[slotId],
        files: updatedFiles
      }
    });
  };

  // Proceed to payment after upload step
 const proceedToPayment = () => {
  // Validate uploads / redirect link
  const invalidSlots = selectedSlots.filter(slot => {
    const adData = slotAds?.[slot._id];
    return (!adData || (!adData.files?.length && !adData.redirectLink));
  });

  if (invalidSlots.length > 0) {
    notify?.('Please upload files or add a redirect link for all selected slots', 0);
    return;
  }

  // 🔥 Build slot-wise booking payload
  const payload = selectedSlots.map(slot => ({
    slot_id: slot._id,
    screen_id: selectedScreen._id,
    advertiser_id: user._id,

    start_datetime: slot.start_datetime,
    end_datetime: slot.end_datetime,
    duration_minutes: slot.duration_minutes,

    price: slot.price,

    adfiles: (slotAds?.[slot._id]?.files ),
    qrcode: "", // backend will generate later
    redirectlink: slotAds?.[slot._id]?.redirectLink || "",

    currency: slot.currency || "INR",

    booking_status: "pending",
    payment_status: "pending"
  }));

  // ✅ Store in state
  setSlotBookingPayload(payload);

  console.log("Slot Booking Payload:", payload);

  // Move to payment step
  setStep(4);
};





  // Final booking submission
  const handleFinalBooking = () => {

    
    // Prepare final payload according to your schema
    const finalPayload = selectedSlots?.map(slot => ({
      slot_id: slot?._id,
      screen_id: selectedScreen?._id,
      advertiser_id: user?._id, // Assuming user object has _id
      start_datetime: slot?.start_datetime,
      end_datetime: slot?.end_datetime,
      duration_minutes: slot?.duration_minutes,
      price: slot?.price,
      adfiles: (slotAds?.[slot?._id]?.files || []).map(file => file?.name), // You might need to upload files first and get URLs
      qrcode: '', // Generate or leave empty for now
      redirectlink: slotAds?.[slot?._id]?.redirectLink || '',
      currency: slot?.currency || 'INR',
      booking_status: "pending",
      payment_status: "pending"
    }));

    console.log('Final Booking Payload:', finalPayload);


    // Call your booking API here
    // FetchApi('POST', import.meta.env.VITE_USER_URL, "bookslots", finalPayload, null, null, usertoken)
    //   .then((res) => {
    //     notify('Booking successful!', 1);
    //     // Handle success
    //   })
    //   .catch((err) => {
    //     notify('Booking failed', 0);
    //   });
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '--:--';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'Select Date';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSlots?.reduce((sum, slot) => sum + (slot?.price || 0), 0) || 0;
  };

  // Reset booking process
  const resetBooking = () => {
    setStep(1);
    setSelectedScreen(null);
    setSelectedSlots([]);
    setScreenSlots([]);
    setPaymentOption('');
    setBookingSummary(null);
    setSlotAds({});
  };

  // Back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            Digital Screen Advertising
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Book advertising slots on premium digital screens across the city
          </p>
        </header>

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-shrink-0">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base
                  ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
                `}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`
                    h-1 w-8 sm:w-12 md:w-16 lg:w-24
                    ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}
                  `}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 px-1">
            <span className="text-center w-20">Choose Screen</span>
            <span className="text-center w-20">Pick Slots</span>
            <span className="text-center w-20">Upload Ad</span>
            <span className="text-center w-20">Payment</span>
            <span className="text-center w-20">Confirm</span>
          </div>
        </div>

        {/* Back Button for steps 2-5 */}
        {step > 1 && (
          <button
            onClick={goBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {/* Step 1: Screen Selection */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <LocationSearch
                value={searchText}
                onChange={setSearchText}
                containerClass="relative"
                inputClass="
                w-full border border-blue-300 sm:border-blue-400
                p-2 sm:p-3 bg-white text-gray-800
                text-sm sm:text-base
                pl-10 pr-10 rounded-lg sm:rounded-xl
                focus:ring-2 focus:ring-blue-500
                focus:border-transparent
                "
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between my-4 sm:my-6">
                <div className="mb-3 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Available Screens in {address?.city || 'Your Location'}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {screensInArea?.length || 0} screens found
                  </p>
                </div>
                {selectedScreen && (
                  <button
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors self-start"
                  >
                    Continue with Selected
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading screens...</p>
                </div>
              ) : screensInArea?.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😕</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    No screens available
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    No active screens found in this location
                  </p>
                  <button
                    onClick={resetBooking}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Try Another Location
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {screensInArea?.map((screen) => (
                    <div
                      key={screen?._id}
                      onClick={() => handleScreenSelect(screen)}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={screen?.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'}
                          alt={screen?.name || 'Screen'}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                          <span className="text-xs sm:text-sm font-semibold text-gray-800">
                            {getCurrencySymbol?.(screen?.currency || 'INR')}{screen?.price || '1000'}/slot
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-5">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <h3 className="font-bold text-gray-800 text-base sm:text-lg line-clamp-1">{screen?.name || 'Unnamed Screen'}</h3>
                          <span className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                            ⭐ {screen?.rating || '4.0'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{screen?.description || 'No description available'}</p>
                        
                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                          <div className="flex items-center text-xs sm:text-sm text-gray-700">
                            <span className="w-5 sm:w-6">📍</span>
                            <span className="truncate">{screen?.address?.street || 'Street'}, {screen?.address?.city || 'City'}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-700">
                            <span className="w-5 sm:w-6">📐</span>
                            <span>{screen?.size?.diagonal || '--'}" {screen?.orientation || 'landscape'}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-700">
                            <span className="w-5 sm:w-6">🖥️</span>
                            <span>{screen?.resolution?.width || '--'}×{screen?.resolution?.height || '--'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${screen?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {screen?.status ? 'Available' : 'Unavailable'}
                          </span>
                          <button className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors">
                            Select Screen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Slot Selection */}
        {step === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Available Time Slots
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Select available slots for {selectedScreen?.name || 'Selected Screen'}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                  >
                    Change Screen
                  </button>
                  <button
                    onClick={resetBooking}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
                  >
                    Change Location
                  </button>
                </div>
              </div>

              {/* Selected Screen Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <img
                    src={selectedScreen?.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'}
                    alt={selectedScreen?.name || 'Screen'}
                    className="w-full sm:w-24 h-20 sm:h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg sm:text-lg">{selectedScreen?.name || 'Screen Name'}</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedScreen?.address?.street || ''}, {selectedScreen?.address?.city || ''}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                      <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border">
                        {(selectedScreen?.screenType || 'screen')?.toUpperCase()}
                      </span>
                      <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border">
                        {selectedScreen?.size?.diagonal || '--'}" Display
                      </span>
                      <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border">
                        ⭐ {selectedScreen?.rating || '4.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slot Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">
                  {screenSlots?.[0]?.start_datetime ? formatDate(screenSlots[0].start_datetime) : 'Available Slots'}
                </h3>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading slots...</p>
                  </div>
                ) : screenSlots?.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📅</div>
                    <p className="text-gray-600 text-sm sm:text-base">No slots available for this screen</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {screenSlots?.map((slot) => {
                      const isSelected = selectedSlots?.find(s => s?._id === slot?._id);
                      const isAvailable = slot?.status === 'available';
                      
                      return (
                        <button
                          key={slot?._id}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!isAvailable}
                          className={`
                            p-3 sm:p-4 rounded-lg sm:rounded-xl border text-center transition-all duration-200
                            ${isSelected 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 transform scale-105 shadow-lg' 
                              : isAvailable
                                ? 'bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-md border-gray-200'
                                : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className="font-medium text-xs sm:text-sm">
                            {formatTime(slot?.start_datetime)} - {formatTime(slot?.end_datetime)}
                          </div>
                          <div className="text-xs mt-1">
                            {isSelected ? (
                              <span className="font-semibold">Selected</span>
                            ) : isAvailable ? (
                              <span className="text-gray-600">Available</span>
                            ) : (
                              <span className="text-gray-500">Booked</span>
                            )}
                          </div>
                          <div className={`mt-1 sm:mt-2 font-semibold text-xs sm:text-sm ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                            {getCurrencySymbol?.(slot?.currency || 'INR')}{slot?.price || '0'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Slots Summary */}
              {selectedSlots?.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-200 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Selected Slots ({selectedSlots?.length || 0})
                    </h3>
                    <div className="font-bold text-lg sm:text-xl text-gray-800">
                      Total: {getCurrencySymbol?.(selectedSlots?.[0]?.currency || 'INR')}{calculateTotal()}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 sm:mb-6">
                    {selectedSlots?.map((slot) => (
                      <div key={slot?._id} className="flex items-center justify-between bg-white/50 p-2 sm:p-3 rounded-lg">
                        <span className="font-medium text-sm sm:text-base">
                          {formatTime(slot?.start_datetime)} - {formatTime(slot?.end_datetime)}
                        </span>
                        <span className="font-semibold text-green-700 text-sm sm:text-base">
                          {getCurrencySymbol?.(slot?.currency || 'INR')}{slot?.price || '0'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto"
                    >
                      Proceed to Upload Ads
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Upload Ads for Each Slot */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Upload Advertisement Content
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Add files and redirect links for each selected slot
                  </p>
                </div>
              </div>

              {/* Screen Info */}

              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedScreen?.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'}
                    alt={selectedScreen?.name || 'Screen'}
                    className="w-16 h-12 sm:w-20 sm:h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{selectedScreen?.name || 'Screen Name'}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {selectedSlots?.length || 0} slot{selectedSlots?.length !== 1 ? 's' : ''} selected • Total: {getCurrencySymbol?.(selectedSlots?.[0]?.currency || 'INR')}{calculateTotal()}
                    </p>
                  </div>
                </div>
              </div>



              {/* Supported Formats Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800 text-sm sm:text-base">Supported Formats</p>
                    <p className="text-yellow-700 text-xs sm:text-sm">
                      {(selectedScreen?.supportedFormats?.join(', ')?.toUpperCase() || 'MP4, JPG, PNG')} • 
                      Max file size: {selectedScreen?.maxFileSize || 100}MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Sections for Each Slot */}
              <div className="space-y-4 sm:space-y-6">
                {selectedSlots?.map((slot, index) => (
                  <div key={slot?._id} className="border border-gray-200 rounded-xl p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                          Slot {index + 1}: {formatTime(slot?.start_datetime)} - {formatTime(slot?.end_datetime)}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {formatDate(slot?.start_datetime)} • {slot?.duration_minutes || '--'} minutes
                        </p>
                      </div>
                      <span className="font-semibold text-blue-600 text-sm sm:text-base">
                        {getCurrencySymbol?.(slot?.currency || 'INR')}{slot?.price || '0'}
                      </span>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4 sm:mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Files
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id={`file-upload-${slot?._id}`}
                          multiple
                          accept={(selectedScreen?.supportedFormats?.map(format => `.${format}`)?.join(',') || ".mp4,.jpg,.png")}
                          className="hidden"
                          onChange={(e) => handleFileUpload(slot?._id, e.target.files)}
                        />
                        <label
                          htmlFor={`file-upload-${slot?._id}`}
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-600 text-xs sm:text-sm mb-1">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedScreen?.supportedFormats?.join(', ')?.toUpperCase() || 'MP4, JPG, PNG')} up to {selectedScreen?.maxFileSize || 100}MB
                          </p>
                        </label>
                      </div>

                      {/* Uploaded Files List */}
                      {slotAds?.[slot?._id]?.files?.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                          <div className="space-y-2">
                            {slotAds?.[slot?._id]?.files?.map((file, fileIndex) => (
                              <div key={fileIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                                <div className="flex items-center truncate">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[150px] sm:max-w-xs">
                                    {file?.name || 'Unnamed file'}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                                    ({(file?.size / 1024 / 1024)?.toFixed(2)}MB)
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile(slot?._id, fileIndex)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Redirect Link Input */}
                    <div>
                      <label htmlFor={`redirect-link-${slot?._id}`} className="block text-sm font-medium text-gray-700 mb-2">
                        OR Add Redirect Link (Optional)
                      </label>
                      <div className="flex">
                        <div className="relative flex-grow">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <input
                            type="url"
                            id={`redirect-link-${slot?._id}`}
                            value={slotAds?.[slot?._id]?.redirectLink || ''}
                            onChange={(e) => handleRedirectLinkChange(slot?._id, e.target.value)}
                            placeholder="https://example.com/your-landing-page"
                            className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        QR code will be generated automatically for this link
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  ← Back to Slots
                </button>
                <button
                  onClick={proceedToPayment}
                  className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm sm:text-base"
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment Options */}
        {step === 4 && (
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
                  onClick={() => setStep(3)}
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
        )}

      

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>© 2024 Digital Screen Advertising Platform. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">Need help? Contact support@adscreens.com</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SlotBooking;