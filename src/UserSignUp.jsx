import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from 'react-select'; // Import react-select
import { Context } from "./Context_holder";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocationSearch from "./ReusedComponents/LocationSearch";
import currencyOptions from "./CurrenciesJson.json";



export default function UserSignUp() {
  const { setusertoken, setuser, notify, FetchApi } = useContext(Context);
  const path = useLocation()?.pathname?.replace("/", "");
  
  const [User, setUser] = useState(null);
  const [Phone, setPhone] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [Role, setRole] = useState("");
  const [paymentGetCurrency, setPaymentGetCurrency] = useState({ value: "USD", label: "USD - US Dollar" });
  
  // Currency options for react-select
  // const currencyOptions = [
  //   { value: "USD", label: "USD - US Dollar" },
  //   { value: "EUR", label: "EUR - Euro" },
  //   { value: "GBP", label: "GBP - British Pound" },
  //   { value: "INR", label: "INR - Indian Rupee" },
  //   { value: "CAD", label: "CAD - Canadian Dollar" },
  //   { value: "AUD", label: "AUD - Australian Dollar" },
  //   { value: "JPY", label: "JPY - Japanese Yen" },
  //   { value: "CNY", label: "CNY - Chinese Yuan" },
  //   { value: "CHF", label: "CHF - Swiss Franc" },
  //   { value: "SGD", label: "SGD - Singapore Dollar" },
  //   { value: "AED", label: "AED - UAE Dirham" },
  //   { value: "SAR", label: "SAR - Saudi Riyal" },
  // ];
  
  // Address states
  const [searchText, setSearchText] = useState("");
  
  // Loading states for form submission and API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    coordinates: { lat: "", lng: "" },
  });

  // Custom styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "black",
      borderColor: state.isFocused ? "#FFD700" : "#FFD700",
      boxShadow: state.isFocused ? "0 0 0 1px #FFD700" : "none",
      "&:hover": {
        borderColor: "#FFD700"
      },
      minHeight: "44px",
      borderRadius: "6px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "black",
      border: "1px solid #FFD700",
      borderRadius: "6px",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: "black",
      maxHeight: "200px",
      borderRadius: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#1a1a1a" : "black",
      color: state.isFocused ? "#FFD700" : "#FFD700",
      "&:active": {
        backgroundColor: "#1a1a1a",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#FFD700",
    }),
    input: (base) => ({
      ...base,
      color: "#FFD700",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#666",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#FFD700",
      "&:hover": {
        color: "#FFD700",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#FFD700",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#FFD700",
      "&:hover": {
        color: "#FFD700",
      },
    }),
  };

  // Load user data for edit mode
  useEffect(() => {
    if (path === "edituserprofile") {
      setIsLoadingUserData(true);
      const user = JSON.parse(localStorage?.getItem("user"));
      
      if (!user) {
        setIsLoadingUserData(false);
        return;
      }
      
      // Simulate loading for better UX
      setTimeout(() => {
        setPaymentMethod(user?.paymentMethod || "bank_transfer");
        setPhone(user?.phone);
        setAddress(user?.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          coordinates: { lat: "", lng: "" },
        });
        setUser(user);
        setRole(user?.role || "");
        
        // Set currency for react-select
        const userCurrency = user?.PaymentGetcurrency || "USD";
        const selectedCurrency = currencyOptions.find(option => option.value === userCurrency) || 
                               { value: "USD", label: "USD - US Dollar" };
        setPaymentGetCurrency(selectedCurrency);
        
        setIsLoadingUserData(false);
      }, 500);
    }
  }, [path]);

  const navigatorRoute = useNavigate();
  const debounceTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        // Handle outside click if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Start loading
    setIsSubmitting(true);

    let password = "";
    let confirmPassword = "";
    
    // Validate phone number
    if (!Phone) {
      notify("Phone number is required", 0);
      setIsSubmitting(false);
      return;
    }

    // Validate PaymentGetcurrency
    if (!paymentGetCurrency) {
      notify("Payment currency is required", 0);
      setIsSubmitting(false);
      return;
    }

    if (!User && path !== "edituserprofile") {
      password = e.target.password.value;
      confirmPassword = e.target.confirmpassword.value;

      if (password !== confirmPassword) {
        notify("Passwords do not match", 0);
        setIsSubmitting(false);
        return;
      }
    }
    
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: Phone.replace("+", ""),
      role: Role,
      businessName: e.target.businessName.value,
      taxId: e.target.taxId.value,
      paymentMethod,
      PaymentGetcurrency: paymentGetCurrency.value, // Use the value from react-select
      bankDetails:
        paymentMethod === "bank_transfer"
          ? {
              accountNumber: e.target.accountNumber?.value || "",
              bankName: e.target.bankName?.value || "",
              ifscCode: e.target.ifscCode?.value || "",
              accountHolder: e.target.accountHolder?.value || "",
              sortcode: e.target.sortCode?.value || "",
              IBAN: e.target.iban?.value || "",
              SWIFT: e.target.swift?.value || "",
            }
          : {},
      address,
    };

    if (path === "edituserprofile" && User) {
      data.user_id = User?._id;
    }

    if (path !== "edituserprofile" && !User && password !== "" && confirmPassword !== "") {
      data.password = password;
      data.confirm_password = confirmPassword;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}/sign_up`,
        data
      )
      .then((response) => {
        const { data } = response;
        notify(data.msg, data.status);
        
        if (data.status === 1) {
          e.target.reset();
          setPhone(null);
          setSearchText("");
          setAddress({
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            coordinates: { lat: "", lng: "" },
          });
          setPaymentGetCurrency({ value: "USD", label: "USD - US Dollar" }); // Reset currency
          
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("usertoken", data.token);
          
          setuser(data.user);
          setusertoken(data.token);
          
          navigatorRoute("/userprofile");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        notify(error.response?.data?.msg || "Signup failed", 0);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Show loading overlay while fetching user data
  if (isLoadingUserData) {
    return (
      <div className="px-3 w-full py-4 min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-8 rounded-md shadow-md bg-black border border-[#FFD700] text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FFD700] border-solid mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-[#FFD700] mb-2">Loading User Data</h3>
          <p className="text-gray-400">Please wait while we load your profile information...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-3 w-full py-4 min-h-screen bg-black">
      {/* Global Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-black border border-[#FFD700] rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FFD700] border-solid mb-4"></div>
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">
              {path === "edituserprofile" && User ? "Updating Profile..." : "Creating Account..."}
            </h3>
            <p className="text-gray-400">Please wait while we process your request...</p>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-2xl mx-auto p-4 rounded-md shadow-md bg-black border border-[#FFD700] relative">
        {/* Form Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-10 rounded-md flex items-center justify-center">
            <div className="text-center">
              {/* Loading spinner */}
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FFD700]">
          {path === "edituserprofile" && User ? "Edit Profile" : "User Sign-Up"}
        </h2>
        
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 max-h-[65vh] overflow-y-auto"
        >
          {/* Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-[#FFD700] text-sm">Name *</label>
            <input
              type="text"
              name="name"
              defaultValue={User?.name}
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Email */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-[#FFD700] text-sm">Email *</label>
            <input
              type="email"
              name="email"
              defaultValue={User?.email}
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Phone */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-[#FFD700] text-sm">Phone *</label>
            <PhoneInput
              value={Phone}
              defaultCountry="IN"
              onChange={setPhone}
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Address Section */}
          <div className="col-span-1 md:col-span-2 border border-[#FFD700] p-3 rounded-md relative">
            <h3 className="text-[#FFD700] font-semibold text-sm mb-2">Address *</h3>
            
            {/* Address Search */}
            <div className="mb-3 relative">
              <label className="text-[#FFD700] text-xs mb-1 block">Search Address</label>
              <LocationSearch
                value={searchText}
                onChange={setSearchText}
                disabled={isSubmitting}
                inputClass="border border-[#FFD700] bg-black text-[#FFD700]"
                containerClass="relative"
                onSelect={(location) => {
                  setAddress({
                    street: location.street,
                    city: location.city,
                    state: location.state,
                    zipCode: location.zipCode,
                    country: location.country,
                    coordinates: location.coordinates,
                  });
                }}
              />
            </div>
            
            {/* Address Preview */}
            {address.street && (
              <div className="mt-4 p-3 border border-[#FFD700] rounded-md bg-gradient-to-r from-[#1a1a1a] to-black">
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-[#FFD700] mr-2" />
                  <h4 className="text-[#FFD700] font-bold text-sm">Selected Address</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="text-gray-400">Street</div>
                    <div className="text-[#FFD700]">{address.street}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">City</div>
                    <div className="text-[#FFD700]">{address.city}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">State</div>
                    <div className="text-[#FFD700]">{address.state}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">ZIP Code</div>
                    <div className="text-[#FFD700]">{address.zipCode}</div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="text-gray-400">Country</div>
                    <div className="text-[#FFD700]">{address.country}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Role */}
          <div>
            <label className="text-[#FFD700] text-sm">Role *</label>
            <select
              name="role"
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              value={Role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Role</option>
              <option value="advertiser">Advertiser</option>
              <option value="screen_owner">Screen Owner</option>
            </select>
          </div>
          
          {/* Payment Get Currency - React Select Version */}
          <div>
            <label className="text-[#FFD700] text-sm"> Currency In Which Want To Get Payment *</label>
            <Select
              value={paymentGetCurrency}
              onChange={setPaymentGetCurrency}
              options={currencyOptions}
              styles={customStyles}
              isSearchable={true}
              isDisabled={isSubmitting}
              placeholder="Select currency..."
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
            <input
              type="hidden"
              name="paymentGetCurrency"
              value={paymentGetCurrency?.value || ""}
              required
            />
          </div>
          
          {/* Business Name */}
          <div>
            <label className="text-[#FFD700] text-sm">Business Name</label>
            <input
              type="text"
              name="businessName"
              placeholder="Optional"
              defaultValue={User?.businessName}
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Tax ID */}
          <div>
            <label className="text-[#FFD700] text-sm">Tax ID</label>
            <input
              type="text"
              name="taxId"
              defaultValue={User?.taxId}
              placeholder="Optional"
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Payment Method */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-[#FFD700] text-sm">Payment Method *</label>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-[#FFD700] rounded-md p-2 bg-black text-[#FFD700]"
              required
              disabled={isSubmitting}
            >
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          
          {/* Bank Details */}
          {paymentMethod === "bank_transfer" && (
            <div className="col-span-1 md:col-span-2 border border-[#FFD700] p-3 rounded-md">
              <h4 className="text-[#FFD700] font-semibold text-sm mb-3">Bank Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#FFD700] text-xs">Account Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    defaultValue={User?.bankDetails?.accountNumber}
                    required={paymentMethod === "bank_transfer"}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    defaultValue={User?.bankDetails?.bankName}
                    placeholder="Bank Name"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    required={paymentMethod === "bank_transfer"}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">IFSC Code </label>
                  <input
                    type="text"
                    name="ifscCode"
                    defaultValue={User?.bankDetails?.ifscCode}
                    placeholder="IFSC Code"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">Account Holder Name *</label>
                  <input
                    type="text"
                    name="accountHolder"
                    defaultValue={User?.bankDetails?.accountHolder}
                    placeholder="Account Holder Name"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    required={paymentMethod === "bank_transfer"}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">Sort Code</label>
                  <input
                    type="text"
                    name="sortCode"
                    defaultValue={User?.bankDetails?.sortcode}
                    placeholder="Sort Code"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">IBAN</label>
                  <input
                    type="text"
                    name="iban"
                    defaultValue={User?.bankDetails?.IBAN}
                    placeholder="IBAN"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[#FFD700] text-xs">SWIFT/BIC Code</label>
                  <input
                    type="text"
                    name="swift"
                    defaultValue={User?.bankDetails?.SWIFT}
                    placeholder="SWIFT/BIC Code"
                    className="w-full border border-[#FFD700] p-2 bg-black text-[#FFD700] mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}
          
          {!User && path !== "edituserprofile" && (
            <>
              {/* Password */}
              <div className="relative">
                <label className="text-[#FFD700] text-sm">Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full border border-[#FFD700] rounded-md p-2 pr-10 bg-black text-[#FFD700]"
                  required
                  minLength="6"
                  disabled={isSubmitting}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-[#FFD700] cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              
              {/* Confirm Password */}
              <div className="relative">
                <label className="text-[#FFD700] text-sm">Confirm Password *</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  className="w-full border border-[#FFD700] rounded-md p-2 pr-10 bg-black text-[#FFD700]"
                  required
                  minLength="6"
                  disabled={isSubmitting}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-[#FFD700] cursor-pointer"
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </>
          )}
          
          <div className="col-span-1 md:col-span-2">
            <button 
              type="submit" 
              className="w-full py-2 rounded-md text-black bg-[#FFD700] font-bold hover:bg-[#e6c200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
                  {path === "edituserprofile" && User ? "Saving..." : "Creating Account..."}
                </>
              ) : (
                path === "edituserprofile" && User ? "Save Changes" : "Sign Up"
              )}
            </button>
          </div>
        </form>
        
        {path !== "edituserprofile" && !User && (
          <Link
            to="/userlogin"
            className="mt-4 text-[#FFD700] text-sm text-center block hover:underline"
          >
            Already have an account? <span className="font-semibold">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// Add this missing icon component
const FaChevronRight = ({ className }) => (
  <svg className={className} fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);