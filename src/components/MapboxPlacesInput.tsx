import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapboxPlacesInputProps {
  value: string;
  onChange: (address: string, placeDetails?: any) => void;
  onLocationExtracted?: (locationData: any) => void;
  placeholder?: string;
  className?: string;
}

const MapboxPlacesInput: React.FC<MapboxPlacesInputProps> = ({
  value,
  onChange,
  onLocationExtracted,
  placeholder = "Enter street address, landmark, or area",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=ng&q=${encodeURIComponent(query)}`
        )}`
      );
      const proxyData = await response.json();
      const data = JSON.parse(proxyData.contents);
      
      setSuggestions(data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address
      })));
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(query);
      setShowSuggestions(true);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.display_name, suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (suggestion.address && onLocationExtracted) {
      const locationData = {
        fullAddress: suggestion.display_name,
        state: suggestion.address.state,
        city: suggestion.address.city || suggestion.address.town || suggestion.address.suburb,
        area: suggestion.address.neighbourhood || suggestion.address.suburb,
        coordinates: { lat: suggestion.lat, lon: suggestion.lon }
      };
      
      onLocationExtracted(locationData);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.allorigins.win/get?url=${encodeURIComponent(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=ng`
              )}`
            );
            const proxyData = await response.json();
            const data = JSON.parse(proxyData.contents);
            
            if (data.display_name) {
              onChange(data.display_name, data);
              if (onLocationExtracted && data.address) {
                onLocationExtracted({
                  fullAddress: data.display_name,
                  state: data.address.state,
                  city: data.address.city || data.address.town || data.address.suburb,
                  area: data.address.neighbourhood || data.address.suburb,
                  coordinates: { lat: latitude, lon: longitude }
                });
              }
            }
          } catch (error) {
            console.error('Error getting current location:', error);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <MapPin size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
      
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={loading}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs disabled:opacity-50"
      >
        <Navigation size={14} />
        Current location
      </button>
      
      {loading && (
        <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.display_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapboxPlacesInput;