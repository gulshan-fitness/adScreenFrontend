import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';

// Import React Icons
import { 
  FaSave, 
  FaDesktop,
  FaRulerCombined,
  FaVideo,
  FaCheckCircle,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaSpinner,
  FaUpload,
  FaImage,
  FaHome,
  FaBuilding,
  FaRoad,
  FaMapPin,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';
import { 
  MdScreenShare, 
  MdFormatSize,
  MdLocationCity,
  MdLandscape,
  MdOutlinePortrait,
  MdCropSquare
} from 'react-icons/md';
import { Context } from '../Context_holder';
import LocationSearch from '../ReusedComponents/LocationSearch';

const AdScreenAdd = () => {
  const { notify, FetchApi, usertoken, user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
 
  const [activeStep, setActiveStep] = useState(0);

  // Location search states
  const [searchText, setSearchText] = useState("");


  // Form state
  const [formData, setFormData] = useState({
    screenName:'',
    user_id: '',
    screenType: '',
    locationType: '',
    orientation: 'landscape',
    status: true,
    rating: 0,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      coordinates: {
        type: "Point",

        coordinates: [] 
    
      }
    },
    resolution: { width: '', height: '' },
    size: { width: '', height: '', diagonal: '' },
    maxFileSize: 100,
    supportedFormats: [],
    image: null
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      user_id: user?._id
    }));
  }, [user]);

 

  // Format options
  const formatOptions = [
    'mp4', 'mov', 'avi', 'mkv', 'jpg', 'png', 'gif', 'webm', 'other'
  ];

  // Screen type options
  const screenTypes = [
    { value: 'led', label: 'LED Display' },
    { value: 'lcd', label: 'LCD Screen' },
    { value: 'oled', label: 'OLED Screen' },
    { value: 'digital_billboard', label: 'Digital Billboard' },
    { value: 'projection', label: 'Projection Screen' },
    { value: 'transit', label: 'Transit Display' },
    { value: 'mall', label: 'Mall Screen' },
    { value: 'outdoor', label: 'Outdoor Display' },
    { value: 'indoor', label: 'Indoor Display' },
    { value: 'other', label: 'Other' }
  ];

  // Location type options
  const locationTypes = [
    { value: 'metro_station', label: 'Metro Station', icon: <FaBuilding className="text-sm" /> },
    { value: 'airport', label: 'Airport', icon: <FaBuilding className="text-sm" /> },
    { value: 'railway_station', label: 'Railway Station', icon: <FaBuilding className="text-sm" /> },
    { value: 'bus_stand', label: 'Bus Stand', icon: <FaBuilding className="text-sm" /> },
    { value: 'shopping_mall', label: 'Shopping Mall', icon: <FaBuilding className="text-sm" /> },
    { value: 'commercial_complex', label: 'Commercial Complex', icon: <FaBuilding className="text-sm" /> },
    { value: 'office_building', label: 'Office Building', icon: <FaBuilding className="text-sm" /> },
    { value: 'hospital', label: 'Hospital', icon: <FaHome className="text-sm" /> },
    { value: 'educational', label: 'Educational Institution', icon: <FaHome className="text-sm" /> },
    { value: 'hotel', label: 'Hotel', icon: <FaHome className="text-sm" /> },
    { value: 'restaurant', label: 'Restaurant', icon: <FaHome className="text-sm" /> },
    { value: 'highway', label: 'Highway', icon: <FaRoad className="text-sm" /> },
    { value: 'main_road', label: 'Main Road', icon: <FaRoad className="text-sm" /> },
    { value: 'junction', label: 'Junction', icon: <FaMapPin className="text-sm" /> },
    { value: 'park', label: 'Park', icon: <FaMapPin className="text-sm" /> },
    { value: 'stadium', label: 'Stadium', icon: <FaBuilding className="text-sm" /> },
    { value: 'theater', label: 'Theater', icon: <FaBuilding className="text-sm" /> },
    { value: 'cinema', label: 'Cinema', icon: <FaBuilding className="text-sm" /> },
    { value: 'residential', label: 'Residential Area', icon: <FaHome className="text-sm" /> },
    { value: 'other', label: 'Other', icon: <FaMapPin className="text-sm" /> }
  ];

  const steps = [
    'Basic',
    'Location',
    'Technical',
    'Media',
    'Review'
  ];

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up timeout on component unmount
  // useEffect(() => {
  //   return () => {
  //     if (debounceTimeoutRef.current) {
  //       clearTimeout(debounceTimeoutRef.current);
  //     }
  //   };
  // }, []);








 

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      notify("Geolocation not supported by your browser", 0);
      return;
    }
    
    setIsFetchingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await FetchApi(null, import.meta.env.VITE_LOCATIONAPI_URL, "currentlocation", `${lng}/${lat}`, null, null, null);
          const comp = res && res;
          
          setFormData(prev => ({
            ...prev,
            address: {
              street: comp.address_line1 || "",
              city: comp.city || "",
              state: comp.state || "",
              zipCode: comp.postcode || "",
              country: comp.country || "",

              coordinates: {
                type:"Point",
    
                coordinates:  [lng,lat] 
            
              }
              
            }
          }));
          
          setSearchText(comp.formatted);
          notify("Current location fetched successfully", 1);
        } catch (err) {
          notify("Unable to fetch address details", 0);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            notify("Location permission denied. Please enable location services.", 0);
            break;
          case error.POSITION_UNAVAILABLE:
            notify("Location information is unavailable.", 0);
            break;
          case error.TIMEOUT:
            notify("Location request timed out.", 0);
            break;
          default:
            notify("Error getting your location.", 0);
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      return;
    }

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]:
            keys[2]
              ? {
                  ...prev[keys[0]][keys[1]],
                  [keys[2]]: type === "checkbox" ? checked : value,
                }
              : type === "checkbox"
              ? checked
              : value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormatToggle = (format) => {
    setFormData(prev => ({
      ...prev,
      supportedFormats: prev.supportedFormats.includes(format)
        ? prev.supportedFormats.filter(f => f !== format)
        : [...prev.supportedFormats, format]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usertoken || !user) return;

    setLoading(true);
    setSubmitError('');
   

    if (!formData.screenType) {
      setSubmitError('Screen type is required');
      setLoading(false);
      return;
    }
    if (!formData.locationType) {
      setSubmitError('Location type is required');
      setLoading(false);
      return;
    }
    if (!formData.resolution.width || !formData.resolution.height) {
      setSubmitError('Resolution is required');
      setLoading(false);
      return;
    }
    if (!formData.size.width || !formData.size.height || !formData.size.diagonal) {
      setSubmitError('Screen size is required');
      setLoading(false);
      return;
    }



    const fd = new FormData();


    if (formData?.image) {
      fd.append("image", formData.image);
    }

    const { image, ...rest } = formData;

    fd.append("data", JSON.stringify(rest));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}adscreenSubmit`,
        fd,
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
              screenName:'',
            user_id: user?._id,
            screenType: '',
            locationType: '',
            orientation: 'landscape',
            status: true,
            rating: 0,
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              coordinates:{
                type: "Point",
                coordinates:[]

              }
            },
            resolution: { width: '', height: '' },
            size: { width: '', height: '', diagonal: '' },
            maxFileSize: 100,
            supportedFormats: [],
            image: null
          });
          setSearchText('');
          setActiveStep(0);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save AdScreen';
      setSubmitError(errorMessage);
      notify(errorMessage, 0);
    } finally {
      setLoading(false);
    }

    
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Basic Information
        return (
          <div className="form-step">
            <h3 className="text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaDesktop className="text-blue-500" /> Basic Information
            </h3>


            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdScreenShare />Name*
              </label>
             <input
                    type="text"
                    name="screenName"
                    value={formData.screenName}
                    onChange={handleInputChange}
                    placeholder="Enter Screen Name"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
            </div>

   
                
            
            
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdScreenShare /> Screen Type *
              </label>
              <select 
                name="screenType"
                value={formData.screenType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Select Screen Type</option>
                {screenTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdLocationCity /> Location Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 max-h-[300px] sm:max-h-none overflow-y-auto p-1">
                {locationTypes.map(loc => (
                  <div 
                    key={loc.value}
                    className={`p-2 sm:p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                      formData.locationType === loc.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => !loading && setFormData(prev => ({...prev, locationType: loc.value}))}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-600">{loc.icon}</span>
                      <span className="text-xs sm:text-sm truncate">{loc.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdLandscape /> Orientation
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className={`flex-1 p-2 sm:p-3 border rounded-md flex items-center justify-center gap-2 text-sm sm:text-base ${
                    formData.orientation === 'landscape' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => !loading && setFormData(prev => ({...prev, orientation: 'landscape'}))}
                  disabled={loading}
                >
                  <MdLandscape /> Landscape
                </button>
                <button
                  type="button"
                  className={`flex-1 p-2 sm:p-3 border rounded-md flex items-center justify-center gap-2 text-sm sm:text-base ${
                    formData.orientation === 'portrait' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => !loading && setFormData(prev => ({...prev, orientation: 'portrait'}))}
                  disabled={loading}
                >
                  <MdOutlinePortrait /> Portrait
                </button>
                <button
                  type="button"
                  className={`flex-1 p-2 sm:p-3 border rounded-md flex items-center justify-center gap-2 text-sm sm:text-base ${
                    formData.orientation === 'square' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => !loading && setFormData(prev => ({...prev, orientation: 'square'}))}
                  disabled={loading}
                >
                  <MdCropSquare /> Square
                </button>
              </div>
            </div>
          </div>
        );

      case 1: // Location Details
        return (
          <div className="form-step">
            <h3 className="text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" /> Location Details
            </h3>
            
            <div className="mb-4 sm:mb-6 border border-blue-200 sm:border-blue-400 p-3 sm:p-4 rounded-md relative bg-gradient-to-r from-blue-50 to-white">
              {( loading) && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-10 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid mx-auto mb-2"></div>
                    <p className="text-blue-500 text-xs">Loading...</p>
                  </div>
                </div>
              )}
              
              <h3 className="text-blue-600 font-semibold text-sm mb-3">Address *</h3>
              
              <div className="mb-4 relative">


              <div className="mb-4">
  <label className="text-blue-600 text-xs mb-1 block">
    Search Address
  </label>

  <LocationSearch
    value={searchText}
    onChange={setSearchText}
    disabled={loading}
    containerClass="relative"
    inputClass="
      w-full border border-blue-300 sm:border-blue-400
      p-2 bg-white text-gray-800
      text-sm sm:text-base
      pl-10 pr-10 rounded-md
      focus:ring-2 focus:ring-blue-500
      focus:border-transparent
    "
    onSelect={(location) => {
      setFormData(prev => ({
        ...prev,
        address: {
          street: location.street,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          country: location.country,

          coordinates: {
            type: "Point",

            coordinates: [location?.coordinates?.lng,location?.coordinates?.lat] 
        
          }

         
          
      
        }
      }));
    }}
  />


</div>

              </div>
              
           
              {formData.address.street && (
                <div className="mt-4 p-3 border border-blue-300 sm:border-blue-400 rounded-md bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-500 mr-2 text-sm" />
                    <h4 className="text-blue-600 font-bold text-sm">Selected Address</h4>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-600 text-xs">Street</div>
                        <div className="text-blue-600 font-medium truncate">{formData.address.street}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">City</div>
                        <div className="text-blue-600 font-medium">{formData.address.city}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">State</div>
                        <div className="text-blue-600 font-medium">{formData.address.state}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">ZIP Code</div>
                        <div className="text-blue-600 font-medium">{formData.address.zipCode}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs">Country</div>
                      <div className="text-blue-600 font-medium">{formData.address.country}</div>
                    </div>
                    {formData.address.coordinates.lat && formData.address.coordinates.lng && (
                      <div>
                        <div className="text-gray-600 text-xs">Coordinates</div>
                        <div className="text-blue-600 font-medium text-xs">
                          {formData.address.coordinates.lat}, {formData.address.coordinates.lng}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Technical Specifications
        return (
          <div className="form-step">
            <h3 className="text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaRulerCombined className="text-blue-500" /> Technical Specifications
            </h3>
            
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution (Pixels) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Width</label>
                  <input
                    type="number"
                    name="resolution.width"
                    value={formData.resolution.width}
                    onChange={handleInputChange}
                    placeholder="Width (px)"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Height</label>
                  <input
                    type="number"
                    name="resolution.height"
                    value={formData.resolution.height}
                    onChange={handleInputChange}
                    placeholder="Height (px)"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Size (Inches) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Width</label>
                  <input
                    type="number"
                    step="0.1"
                    name="size.width"
                    value={formData.size.width}
                    onChange={handleInputChange}
                    placeholder="Width (in)"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Height</label>
                  <input
                    type="number"
                    step="0.1"
                    name="size.height"
                    value={formData.size.height}
                    onChange={handleInputChange}
                    placeholder="Height (in)"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Diagonal</label>
                  <input
                    type="number"
                    step="0.1"
                    name="size.diagonal"
                    value={formData.size.diagonal}
                    onChange={handleInputChange}
                    placeholder="Diagonal (in)"
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Media Settings
        return (
          <div className="form-step">
            <h3 className="text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaVideo className="text-blue-500" /> Media Settings
            </h3>
            
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdFormatSize /> Maximum File Size (MB)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  name="maxFileSize"
                  value={formData.maxFileSize}
                  onChange={handleInputChange}
                  className="w-full sm:flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={loading}
                />
                <span className="font-semibold text-blue-600 text-center text-sm sm:text-base min-w-[60px]">
                  {formData.maxFileSize} MB
                </span>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Supported Formats</label>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map(format => (
                  <button
                    type="button"
                    key={format}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-full transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      formData.supportedFormats.includes(format) 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => !loading && handleFormatToggle(format)}
                    disabled={loading}
                  >
                    {format.toUpperCase()}
                    {formData.supportedFormats.includes(format) && <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaImage /> Screen View 
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 bg-white text-gray-800 text-sm sm:text-base file:mr-4 file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={loading}
                accept="image/*"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700">Active Status</span>
              </label>
            </div>
          </div>
        );

      case 4: // Review & Submit
        return (
          <div className="form-step">
            <h3 className="text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-blue-500" /> Review & Submit
            </h3>
            
            <div className="bg-blue-50 p-4 sm:p-6 rounded-md border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b">Screen Details</h4>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <strong className="text-gray-700 text-sm">Screen Type:</strong> 
                    <div className="mt-1 text-blue-600">{screenTypes.find(s => s.value === formData.screenType)?.label || 'Not set'}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700 text-sm">Location Type:</strong> 
                    <div className="mt-1 text-blue-600">{locationTypes.find(l => l.value === formData.locationType)?.label || 'Not set'}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700 text-sm">Orientation:</strong> 
                    <div className="mt-1 text-blue-600 capitalize">{formData.orientation}</div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h5 className="text-md font-semibold text-gray-800 mb-2">Location</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Address:</strong> 
                      <div className="mt-1 text-blue-600 break-words">{formData.address.street}, {formData.address.city}, {formData.address.state} {formData.address.zipCode}</div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Country:</strong> 
                      <div className="mt-1 text-blue-600">{formData.address.country}</div>
                    </div>
                    {formData.address.coordinates.lat && formData.address.coordinates.lng && (
                      <div>
                        <strong className="text-gray-700">Coordinates:</strong> 
                        <div className="mt-1 text-blue-600 text-xs sm:text-sm">{formData.address.coordinates.lat}, {formData.address.coordinates.lng}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h5 className="text-md font-semibold text-gray-800 mb-2">Technical Specifications</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Resolution:</strong> 
                      <div className="mt-1 text-blue-600">{formData.resolution.width} x {formData.resolution.height} px</div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Size:</strong> 
                      <div className="mt-1 text-blue-600">{formData.size.width}" x {formData.size.height}" (Diagonal: {formData.size.diagonal}")</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h5 className="text-md font-semibold text-gray-800 mb-2">Media Settings</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Max File Size:</strong> 
                      <div className="mt-1 text-blue-600">{formData.maxFileSize} MB</div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Supported Formats:</strong> 
                      <div className="mt-1 text-blue-600 break-words">
                        {formData.supportedFormats.length > 0 ? formData.supportedFormats.join(', ') : 'None selected'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-gray-700">Status:</strong> 
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {formData.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-4 sm:py-8 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <FaDesktop className="text-blue-500 text-xl sm:text-2xl" /> Add New Ad Screen
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Fill in the details to add a new advertising screen to the system
          </p>
        </div>

        {/* Stepper - Mobile Responsive */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 relative px-2 sm:px-0">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mb-1 sm:mb-2 text-xs sm:text-sm ${
                  index === activeStep 
                    ? 'bg-blue-500 text-white border-2 border-blue-500' 
                    : index < activeStep 
                    ? 'bg-green-500 text-white border-2 border-green-500'
                    : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-none ${
                  index === activeStep ? 'text-blue-600 font-semibold' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block flex-1 h-1 mx-2 absolute top-4 sm:top-5 left-0 right-0 ${
                  index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                }`} style={{ left: `${(index + 1) * 20}%`, width: '60%' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg py-4 sm:py-6 px-2 relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-500 border-solid mx-auto mb-2 sm:mb-3"></div>
                <p className="text-blue-600 font-semibold text-sm sm:text-base">Saving Ad Screen...</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Please wait while we process your request</p>
              </div>
            </div>
          )}
          
        
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {submitError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md border-l-4 border-red-500 flex items-start gap-2 text-sm">
                <FaSpinner className="mt-0.5 flex-shrink-0" /> 
                <span>{submitError}</span>
              </div>
            )}

      

            {/* Form Actions */}
            <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              {activeStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading }
                >
                  <FaArrowLeft className="text-xs sm:text-sm" /> Back
                </button>
              ) : (
                <div></div>
              )}

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={loading  }
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading  }
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-xs sm:text-sm" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xs sm:text-sm" /> Save Ad Screen
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdScreenAdd;