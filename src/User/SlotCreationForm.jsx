import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { 
    FaArrowLeft, 
    FaCalendarAlt, 
    FaClock, 
    FaDollarSign, 
    FaInfoCircle,
    FaSave,
    FaTimes,
    FaSearch,
    FaFilter,
    FaMapMarkerAlt,
    FaTv,
    FaCalendarPlus,
    FaCheck,
    FaSpinner,
    FaExclamationTriangle,
    FaEye,
    FaPercentage,
    FaGlobe
} from 'react-icons/fa';
import { Context } from '../Context_holder';

const SlotCreationComponent = () => {
    const { notify, user, FetchApi, usertoken } = useContext(Context);

    // State for flow management
    const [step, setStep] = useState(1);
    const [selectedScreen, setSelectedScreen] = useState(null);
    
    // Screen selection states
    const [screens, setScreens] = useState([]);
    const [filteredScreens, setFilteredScreens] = useState([]);
    const [isLoadingScreens, setIsLoadingScreens] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        locationType: '',
        screenType: '',
        status: 'active'
    });

    // Slot creation states
    const [formData, setFormData] = useState({
        screen_id: '',
        date: new Date(),
        start_time: '09:00',
        end_time: '09:30',
        duration_minutes: 30,
        price: '',
        currency: 'INR',
        timeFormat: '24h',
        status: 'available',
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    
    // Available currencies

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' }
];


    // Fetch screens on component mount
    useEffect(() => {
        if (!user || !usertoken) return;
        setIsLoadingScreens(true);

        FetchApi(null, import.meta.env.VITE_USER_URL, "getownerscreen", user?._id, null, null, usertoken)
            .then((res) => {
                setScreens(res);
                setFilteredScreens(res);
            })
            .catch((err) => {
                setScreens([]);
                setFilteredScreens([]);
                notify('Failed to load screens', 0);
            })
            .finally(() => {
                setIsLoadingScreens(false);
            });
    }, [user, usertoken]);

    // Filter screens when search or filters change
    useEffect(() => {
        filterScreens();
    }, [searchTerm, filters, screens]);

    // Filter screens based on search and filters
    const filterScreens = () => {
        let filtered = [...screens];

        if (searchTerm) {
            filtered = filtered.filter(screen =>
                screen.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.address?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.screenType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.locationType) {
            filtered = filtered.filter(screen => 
                screen.locationType === filters.locationType
            );
        }

        if (filters.screenType) {
            filtered = filtered.filter(screen => 
                screen.screenType === filters.screenType
            );
        }

        if (filters.status) {
            filtered = filtered.filter(screen => 
                filters.status === 'active' ? screen.status === true : screen.status === false
            );
        }

        setFilteredScreens(filtered);
    };

    // Handle screen selection
    const handleScreenSelect = (screen) => {
        setSelectedScreen(screen);
        setFormData(prev => ({
            ...prev,
            screen_id: screen._id,
            price: screen.basePrice || ''
        }));
        setStep(2);
    };

    // Handle back to screen selection
    const handleBackToScreens = () => {
        setSelectedScreen(null);
        setStep(1);
        setErrors({});
        setIsFilterOpen(false);
    };

    // Convert 24-hour time to 12-hour format
    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Convert 12-hour time to 24-hour format
    const convertTo24Hour = (time12) => {
        const [time, period] = time12.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Generate time options based on selected format
    const generateTimeOptions = () => {
        const times = [];
        
        if (formData.timeFormat === '24h') {
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    times.push({
                        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                        display: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                    });
                }
            }
        } else {
            for (let hour = 1; hour <= 12; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const displayHour = hour.toString().padStart(2, '0');
                    times.push(
                        {
                            value: convertTo24Hour(`${displayHour}:${minute.toString().padStart(2, '0')} AM`),
                            display: `${displayHour}:${minute.toString().padStart(2, '0')} AM`
                        },
                        {
                            value: convertTo24Hour(`${displayHour}:${minute.toString().padStart(2, '0')} PM`),
                            display: `${displayHour}:${minute.toString().padStart(2, '0')} PM`
                        }
                    );
                }
            }
        }
        
        return times;
    };

    // Format time for display based on selected format
    const formatTimeDisplay = (time24) => {
        if (formData.timeFormat === '24h') {
            return time24;
        }
        return convertTo12Hour(time24);
    };

    // Calculate end time based on start time and duration
    const calculateEndTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    };

    // Handle time format change
    const handleTimeFormatChange = (format) => {
        setFormData(prev => ({
            ...prev,
            timeFormat: format
        }));
    };

    // Handle duration change
    const handleDurationChange = (duration) => {
        const newEndTime = calculateEndTime(formData.start_time, parseInt(duration));
        setFormData(prev => ({
            ...prev,
            duration_minutes: parseInt(duration),
            end_time: newEndTime
        }));
    };

    // Handle start time change
    const handleStartTimeChange = (time) => {
        const newEndTime = calculateEndTime(time, formData.duration_minutes);
        setFormData(prev => ({
            ...prev,
            start_time: time,
            end_time: newEndTime
        }));
    };

    // Handle currency change
    const handleCurrencyChange = (currencyCode) => {
        setFormData(prev => ({
            ...prev,
            currency: currencyCode
        }));
    };

    // Get currency symbol
    const getCurrencySymbol = (currencyCode) => {
        const currency = currencies.find(c => c.code === currencyCode);
        return currency ? currency.symbol : currencyCode;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.start_time) {
            newErrors.start_time = 'Start time is required';
        }

        if (!formData.duration_minutes || formData.duration_minutes < 15) {
            newErrors.duration_minutes = 'Minimum duration is 15 minutes';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.currency) {
            newErrors.currency = 'Currency is required';
        }

        const [startHour, startMinute] = formData.start_time.split(':').map(Number);
        const [endHour, endMinute] = formData.end_time.split(':').map(Number);
        
        if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
            newErrors.timeRange = 'End time must be after start time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm() || !usertoken) {
            notify('Please fix the errors in the form', 0);
            return;
        }


        try {


            setIsSubmitting(true);
            

 // Combine date and time for start_datetime and end_datetime
 const startDate = new Date(formData.date);
 const [startHour, startMinute] = formData.start_time.split(':');
 startDate.setHours(startHour, startMinute, 0, 0);

 const endDate = new Date(formData.date);
 const [endHour, endMinute] = formData.end_time.split(':');
 endDate.setHours(endHour, endMinute, 0, 0);

 const slotData = {
     screen_id: formData.screen_id,
     start_datetime: startDate,
     end_datetime: endDate,
     date: formData.date,
     start_time: formData.start_time,
     end_time: formData.end_time,
     duration_minutes: formData.duration_minutes,
     price: formData.price,
     currency: formData.currency,
     time_format: formData.timeFormat,
     status: formData.status
 };



            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}addslot`,
              slotData,
              {
                headers: {
                  Authorization: usertoken
                }
              }
            );
      
            const { data } = response;
            notify(data.msg, data.status);
            
            if (data.status === 1) {
                setTimeout(() => {
                    setFormData({
                        screen_id: '',
                        date: new Date(),
                        start_time: '09:00',
                        end_time: '09:30',
                        duration_minutes: 30,
                        price: '',
                        currency: 'INR',
                        timeFormat: '24h',
                        status: 'available'
                    });
                    setSelectedScreen(null);
                    setStep(1);
                    setIsFilterOpen(false);
                }, 2000);
              
           
            }
          } catch (error) {
           
            notify(errorMessage, 0);
          } finally {
            setIsSubmitting(false);
          }

   
    };

    // Helper functions
    const getLocationTypeLabel = (type) => {
        const labels = {
            'metro_station': 'Metro Station',
            'airport': 'Airport',
            'shopping_mall': 'Shopping Mall',
            'highway': 'Highway',
            'office_building': 'Office Building',
            'railway_station': 'Railway Station',
            'bus_stand': 'Bus Stand',
            'commercial_complex': 'Commercial Complex',
            'hospital': 'Hospital',
            'educational': 'Educational',
            'hotel': 'Hotel',
            'restaurant': 'Restaurant',
            'main_road': 'Main Road',
            'junction': 'Junction',
            'park': 'Park',
            'stadium': 'Stadium',
            'theater': 'Theater',
            'cinema': 'Cinema',
            'residential': 'Residential',
            'other': 'Other'
        };
        return labels[type] || type.replace('_', ' ');
    };

    const getScreenTypeIcon = (type) => {
        const icons = {
            'led': '🔴',
            'lcd': '📺',
            'oled': '⚫',
            'digital_billboard': '🏙️',
            'projection': '📽️',
            'transit': '🚌',
            'mall': '🛍️',
            'outdoor': '🌆',
            'indoor': '🏢',
            'other': '📱'
        };
        return icons[type] || '📱';
    };

    const durationOptions = [15, 30, 45, 60, 90, 120, 180, 240];

    // Screen Selection Component
    const renderScreenSelection = () => {
        if (isLoadingScreens) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <FaSpinner className="animate-spin text-4xl text-blue-600" />
                    <p className="text-gray-600">Loading available screens...</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <FaTv className="text-2xl" />
                        Select a Screen
                    </h2>
                    <p className="text-blue-100 mt-2">Choose a screen to create advertising slots for</p>
                </div>

                {/* Search and Filters - Mobile Responsive */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by city, state, or screen type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Filter Toggle for Mobile */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                    >
                        <FaFilter />
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filters Grid */}
                    <div className={`${isFilterOpen ? 'block' : 'hidden md:grid'} grid-cols-1 md:grid-cols-3 gap-4 mt-4`}>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaMapMarkerAlt className="text-blue-500" />
                                Location Type
                            </label>
                            <select 
                                value={filters.locationType}
                                onChange={(e) => setFilters(prev => ({...prev, locationType: e.target.value}))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="">All Locations</option>
                                <option value="metro_station">Metro Station</option>
                                <option value="airport">Airport</option>
                                <option value="shopping_mall">Shopping Mall</option>
                                <option value="highway">Highway</option>
                                <option value="office_building">Office Building</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaTv className="text-purple-500" />
                                Screen Type
                            </label>
                            <select 
                                value={filters.screenType}
                                onChange={(e) => setFilters(prev => ({...prev, screenType: e.target.value}))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="">All Screen Types</option>
                                <option value="led">LED</option>
                                <option value="lcd">LCD</option>
                                <option value="oled">OLED</option>
                                <option value="digital_billboard">Digital Billboard</option>
                                <option value="outdoor">Outdoor</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button 
                                onClick={() => {
                                    setFilters({ locationType: '', screenType: '', status: 'active' });
                                    setSearchTerm('');
                                    setIsFilterOpen(false);
                                }}
                                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Screens Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScreens.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-lg">
                            <FaTv className="text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No screens found</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Try adjusting your search or filters to find available screens
                            </p>
                        </div>
                    ) : (
                        filteredScreens.map(screen => (
                          <div 
  key={screen._id} 
  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 active:scale-[0.98]"
  onClick={() => handleScreenSelect(screen)}
>
  {/* Card Header - More compact on mobile */}
  <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="text-xl sm:text-2xl text-blue-600">
          {getScreenTypeIcon(screen.screenType)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">
            {screen.screenName || 'Digital Screen'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              screen.status 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {screen.status ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs text-gray-500 hidden sm:block">
              ID: {screen._id?.substring(0, 6)}...
            </span>
          </div>
        </div>
      </div>
      {screen.basePrice && (
        <div className="text-right flex-shrink-0">
          <div className="text-lg sm:text-xl font-bold text-blue-600">
            {screen.currency || '₹'}{screen.basePrice}
          </div>
          <div className="text-xs text-gray-500">per slot</div>
        </div>
      )}
    </div>
  </div>

  {/* Screen Image */}
  <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
    {screen.image ? (
      <img 
        src={screen.image} 
        alt={screen.screenName || 'Screen Image'}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl text-gray-300 mb-2">
            {getScreenTypeIcon(screen.screenType)}
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Screen Preview</p>
        </div>
      </div>
    )}
    {/* Floating badges */}
    <div className="absolute top-2 right-2 flex flex-col gap-1">
      <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
        {screen.screenType?.toUpperCase() || 'LCD'}
      </div>
      {screen.rating > 0 && (
        <div className="bg-yellow-100/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-yellow-800 shadow-sm">
          ⭐ {screen.rating.toFixed(1)}
        </div>
      )}
    </div>
  </div>

  {/* Screen Details */}
  <div className="p-4 sm:p-5">
    {/* Location Info */}
    <div className="space-y-3 mb-4">
      <div className="flex items-start gap-2 text-gray-700">
        <span className="text-red-500 mt-0.5">📍</span>
        <div className="flex-1">
          <div className="font-medium text-sm sm:text-base">
            {screen.address?.city || 'City'}, {screen.address?.state || 'State'}
          </div>
          {screen.address?.street && (
            <div className="text-xs text-gray-500 truncate mt-1">
              {screen.address.street}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <span className="text-blue-500">🏢</span>
        <span className="text-sm">
          {getLocationTypeLabel(screen.locationType) || 'Public Space'}
        </span>
      </div>
    </div>

    {/* Specifications Grid - Responsive */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-gray-100">
      <div className="bg-gradient-to-br from-gray-50 to-white p-2 sm:p-3 rounded-lg border border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center">
          <span className="mr-1">🖥️</span> Res
        </div>
        <div className="text-sm font-semibold text-gray-800 truncate">
          {screen.resolution?.width || 0}×{screen.resolution?.height || 0}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-2 sm:p-3 rounded-lg border border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center">
          <span className="mr-1">📐</span> Size
        </div>
        <div className="text-sm font-semibold text-gray-800">
          {screen.size?.diagonal || 0}"
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-2 sm:p-3 rounded-lg border border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center">
          <span className="mr-1">📱</span> Orient
        </div>
        <div className="text-sm font-semibold text-gray-800 capitalize">
          {screen.orientation || 'Landscape'}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-2 sm:p-3 rounded-lg border border-gray-100">
        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center">
          <span className="mr-1">📁</span> Formats
        </div>
        <div className="text-sm font-semibold text-gray-800">
          {screen.supportedFormats?.length || 0}
        </div>
      </div>
    </div>

    {/* Additional Info (Collapsible on mobile) */}
    {screen.supportedFormats?.length > 0 && (
      <details className="group mt-4 sm:hidden">
        <summary className="flex items-center text-xs text-blue-600 font-medium cursor-pointer list-none">
          <span>View supported formats</span>
          <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-2 flex flex-wrap gap-1">
          {screen.supportedFormats.map((format, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
              {format.toUpperCase()}
            </span>
          ))}
        </div>
      </details>
    )}

    {/* Visible on larger screens */}
    {screen.supportedFormats?.length > 0 && (
      <div className="hidden sm:flex flex-wrap gap-1 mt-3">
        {screen.supportedFormats.slice(0, 3).map((format, index) => (
          <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
            {format.toUpperCase()}
          </span>
        ))}
        {screen.supportedFormats.length > 3 && (
          <span className="text-xs text-gray-500">+{screen.supportedFormats.length - 3} more</span>
        )}
      </div>
    )}
  </div>

  {/* Card Footer */}
  <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleScreenSelect(screen);
      }}
      className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
    >
      <span className="text-lg">📅</span>
      <span className="text-sm sm:text-base">Book Slots</span>
    </button>
  </div>
</div>
                        ))
                    )}
                </div>

                {/* Info Footer */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-700">
                                Found <span className="font-bold text-blue-600">{filteredScreens.length}</span> screens
                            </p>
                            <p className="text-sm text-gray-500">
                                Click on any screen to start creating advertising slots
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaInfoCircle className="text-blue-500" />
                            <span>Select time format in next step</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Slot Creation Form Component
    const renderSlotCreationForm = () => {
        const timeOptions = generateTimeOptions();
        
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <button 
                            onClick={handleBackToScreens}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                        >
                            <FaArrowLeft />
                            Back to Screens
                        </button>
                        
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800">Create Advertising Slot</h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-sm font-mono text-gray-500">
                                    Screen ID: {selectedScreen?._id?.substring(0, 8) || 'N/A'}
                                </span>
                                <span className="text-sm text-gray-600">•</span>
                                <span className="text-sm text-gray-600">
                                    {selectedScreen?.address?.city || 'City'}, {selectedScreen?.address?.state || 'State'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="hidden md:block w-32"></div> {/* Spacer for alignment */}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Screen Preview */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg py-6 px-2 sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                                    <FaTv className="text-2xl text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Screen Details</h3>
                                    <p className="text-sm text-gray-500">Selected for slot creation</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Type</div>
                                        <div className="font-semibold text-gray-800">{selectedScreen?.screenType || 'N/A'}</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Location</div>
                                        <div className="font-semibold text-gray-800">{getLocationTypeLabel(selectedScreen?.locationType)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Resolution</div>
                                        <div className="font-semibold text-gray-800">
                                            {selectedScreen?.resolution?.width || 0}×{selectedScreen?.resolution?.height || 0}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Size</div>
                                        <div className="font-semibold text-gray-800">{selectedScreen?.size?.diagonal || 0}"</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <FaInfoCircle className="text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                All slots will be created for this specific screen. The slot will be available for advertisers to book.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg py-6 px-3">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Date Selection */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <FaCalendarAlt className="text-blue-500" />
                                        Select Date
                                    </label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.date}
                                            onChange={(date) => setFormData({...formData, date})}
                                            minDate={new Date()}
                                            dateFormat="MMMM d, yyyy"
                                            className={`w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.date ? 'border-red-300' : 'border-gray-200'}`}
                                            placeholderText="Select date"
                                            popperClassName="z-50"
                                        />
                                        {errors.date && (
                                            <div className="absolute -bottom-6 left-0 text-sm text-red-600 flex items-center gap-1">
                                                <FaExclamationTriangle className="text-sm" />
                                                {errors.date}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                            <FaClock className="text-purple-500" />
                                            Time Configuration
                                        </label>
                                        
                                        {/* Time Format Toggle */}
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleTimeFormatChange('24h')}
                                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${formData.timeFormat === '24h' 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                24-Hour
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTimeFormatChange('12h')}
                                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${formData.timeFormat === '12h' 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                12-Hour
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Start Time */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Start Time</label>
                                            <select
                                                value={formData.start_time}
                                                onChange={(e) => handleStartTimeChange(e.target.value)}
                                                className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.start_time ? 'border-red-300' : 'border-gray-200'}`}
                                            >
                                                {timeOptions.map(time => (
                                                    <option key={time.value} value={time.value}>
                                                        {time.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Duration</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {durationOptions.map(duration => (
                                                    <button
                                                        key={duration}
                                                        type="button"
                                                        onClick={() => handleDurationChange(duration)}
                                                        className={`p-3 text-center rounded-xl transition-all duration-200 ${formData.duration_minutes === duration 
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                    >
                                                        {duration}m
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* End Time */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">End Time</label>
                                            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-xl">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-800 mb-1">
                                                        {formatTimeDisplay(formData.end_time)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Calculated automatically</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {errors.timeRange && (
                                        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-red-600">
                                                <FaExclamationTriangle />
                                                <span>{errors.timeRange}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pricing */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <FaDollarSign className="text-green-500" />
                                        Pricing
                                    </label>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Price Input and Currency Selection */}
                                        <div className="space-y-6">
                                            {/* Currency Selection */}
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <FaGlobe className="text-blue-500" />
                                                    Currency
                                                </label>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                                                    {currencies?.map(currency => (
                                                        <button
                                                            key={currency.code}
                                                            type="button"
                                                            onClick={() => handleCurrencyChange(currency.code)}
                                                            className={`p-3 text-center rounded-xl transition-all duration-200 ${formData.currency === currency.code 
                                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                        >
                                                            <div className="text-sm font-medium">{currency.code}</div>
                                                            <div className="text-xs text-gray-500 truncate">{currency.name}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {errors.currency && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <FaExclamationTriangle className="text-sm" />
                                                        {errors.currency}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Price Input */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Price</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.price ? 'border-red-300' : 'border-gray-200'}`}
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                        <span className="text-gray-500 font-medium">{getCurrencySymbol(formData.currency)}</span>
                                                    </div>
                                                </div>
                                                {errors.price && (
                                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <FaExclamationTriangle className="text-sm" />
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Summary */}
                                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                                            <h4 className="text-lg font-semibold mb-4">Slot Summary</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Time Format</span>
                                                    <span className="font-medium">{formData.timeFormat === '24h' ? '24-Hour' : '12-Hour'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Duration</span>
                                                    <span className="font-medium">{formData.duration_minutes} minutes</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Time Slot</span>
                                                    <span className="font-medium text-right">
                                                        {formatTimeDisplay(formData.start_time)}<br/>
                                                        to {formatTimeDisplay(formData.end_time)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                                    <span className="text-gray-300">Currency</span>
                                                    <span className="font-medium">
                                                        {formData.currency} ({getCurrencySymbol(formData.currency)})
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Price</span>
                                                    <span className="font-medium">
                                                        {getCurrencySymbol(formData.currency)} {parseFloat(formData.price || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                                    <span className="text-lg font-semibold">Total</span>
                                                    <span className="text-2xl font-bold text-green-400">
                                                        {getCurrencySymbol(formData.currency)} {Number(formData.price || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleBackToScreens}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                                        disabled={isSubmitting}
                                    >
                                        <FaTimes />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Creating Slot...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Create Slot
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header with Step Indicator */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                        Create Advertising Slot
                    </h1>
                    
                    {/* Step Indicator */}
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between relative">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${step === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-md'}`}>
                                    {step === 1 ? '1' : <FaCheck />}
                                </div>
                                <span className={`text-sm font-medium ${step === 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                                    Select Screen
                                </span>
                            </div>
                            
                            {/* Progress Line */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gray-200">
                                <div className={`h-full transition-all duration-500 ${step === 2 ? 'w-full bg-gradient-to-r from-blue-600 to-purple-600' : 'w-0'}`}></div>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${step === 2 ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' : 'bg-gray-200'}`}>
                                    2
                                </div>
                                <span className={`text-sm font-medium ${step === 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                                    Create Slot
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    {step === 1 ? renderScreenSelection() : renderSlotCreationForm()}
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            {step === 1 && (
                <div className="md:hidden fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl"
                    >
                        <FaFilter className="text-xl" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SlotCreationComponent;