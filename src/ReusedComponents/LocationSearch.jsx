import React, { useEffect, useRef, useState, useContext } from "react";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Context } from "../Context_holder";

export default function LocationSearch({
  value = "",
  onChange,
  onSelect,
  inputClass = "",
  containerClass = "",
  disabled = false,
}) {
  const { FetchApi, notify } = useContext(Context);

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DEBOUNCED SEARCH ---------------- */
  const handleSearch = (text) => {
    onChange(text);

    if (!text.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await FetchApi(
          null,
          import.meta.env.VITE_LOCATIONAPI_URL,
          "getautosuggestions",
          text,
          null,
          null,
          null
        );
        setSuggestions(res || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  /* ---------------- SELECT SUGGESTION ---------------- */
  const handleSelect = (item) => {
    const p = item.properties;

    const locationData = {
      street: p.address_line1 || "",
      city: p.city || "",
      state: p.state || "",
      zipCode: p.postcode || "",
      country: p.country || "",
      coordinates: {
        lat: p.lat,
        lng: p.lon,
      },
      formatted: p.formatted,
    };

    onSelect(locationData);
    onChange(p.formatted);
    setSuggestions([]);
    setShowDropdown(false);
  };

  /* ---------------- CURRENT LOCATION ---------------- */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      notify("Geolocation not supported", 0);
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await FetchApi(
            null,
            import.meta.env.VITE_LOCATIONAPI_URL,
            "currentlocation",
            `${longitude}/${latitude}`,
            null,
            null,
            null
          );

          onSelect({
            street: res.address_line1 || "",
            city: res.city || "",
            state: res.state || "",
            zipCode: res.postcode || "",
            country: res.country || "",
            coordinates: { lat: latitude, lng: longitude },
            formatted: res.formatted,
          });

          onChange(res.formatted);
          notify("Location fetched", 1);
        } catch {
          notify("Failed to fetch location", 0);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        notify("Location permission denied", 0);
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <div className={containerClass}>
      {/* INPUT */}
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => suggestions.length && setShowDropdown(true)}
          disabled={disabled}
          placeholder="Search address..."
          className={`w-full pl-10 pr-10 p-2 rounded-md ${inputClass}`}
        />

        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 text-sm" />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-b-2 border-yellow-400" />
          ) : showDropdown ? (
            <FaChevronUp className="text-yellow-400" />
          ) : (
            <FaChevronDown className="text-yellow-400" />
          )}
        </div>
      </div>

      {/* DROPDOWN */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 bg-black border border-yellow-400 rounded-md shadow-xl max-h-72 overflow-y-auto"
        >
          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-[#2a2a2a] cursor-pointer text-yellow-400 text-sm"
            >
              <FaMapMarkerAlt className="inline mr-2" />
              {item.properties.formatted}
            </div>
          ))}
        </div>
      )}

      {/* CURRENT LOCATION */}
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={isFetchingLocation || disabled}
        className="mt-2 flex items-center gap-2 text-sm text-yellow-400 hover:underline"
      >
        <FaMapMarkerAlt />
        {isFetchingLocation ? "Fetching..." : "Use current location"}
      </button>
    </div>
  );
}
