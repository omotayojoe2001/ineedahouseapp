import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Smartphone, Monitor } from 'lucide-react';

interface LocationInputWithMapProps {
  value: string;
  onChange: (address: string) => void;
  onLocationChange?: (locationData: any) => void;
  placeholder?: string;
}

const LocationInputWithMap: React.FC<LocationInputWithMapProps> = ({
  value,
  onChange,
  onLocationChange,
  placeholder = "Enter your property address"
}) => {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const [mapKey, setMapKey] = useState(0); // Force map refresh

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  // Update map when address changes
  useEffect(() => {
    if (value && value.includes('GPS Location:')) {
      const coords = value.match(/(-?\d+\.\d+)/g);
      if (coords && coords.length >= 2) {
        setCoordinates({ lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) });
        setMapKey(prev => prev + 1); // Refresh map
      }
    } else if (value && value.length > 10) {
      // Geocode typed address (simplified - you can enhance this)
      geocodeAddress(value);
    }
  }, [value]);

  const geocodeAddress = async (address: string) => {
    // Simple geocoding for Nigerian locations
    const nigerianCities: any = {
      'lekki': { lat: 6.4474, lng: 3.4653 },
      'victoria island': { lat: 6.4281, lng: 3.4219 },
      'ikeja': { lat: 6.5954, lng: 3.3364 },
      'lagos': { lat: 6.5244, lng: 3.3792 },
      'abuja': { lat: 9.0765, lng: 7.3986 },
      'port harcourt': { lat: 4.8156, lng: 7.0498 }
    };

    const addressLower = address.toLowerCase();
    for (const [city, coords] of Object.entries(nigerianCities)) {
      if (addressLower.includes(city)) {
        setCoordinates(coords as any);
        setMapKey(prev => prev + 1);
        break;
      }
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      const options = deviceType === 'mobile' 
        ? { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        : { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const accuracy = position.coords.accuracy;
          
          setCoordinates({ lat: latitude, lng: longitude });
          setMapKey(prev => prev + 1); // Refresh map
          
          // Show raw coordinates
          onChange(`${latitude}, ${longitude}`);
          
          if (onLocationChange) {
            onLocationChange({
              coordinates: { lat: latitude, lng: longitude },
              accuracy,
              source: 'gps'
            });
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          alert(deviceType === 'mobile' 
            ? 'Location access denied. Please enable location services.'
            : 'Desktop GPS may be inaccurate. Try entering address manually.'
          );
          setLoading(false);
        },
        options
      );
    }
  };

  const generateFallbackAddress = (lat: number, lng: number) => {
    // Simple fallback based on known Lagos/Nigeria coordinates
    const lagosAreas = [
      { name: 'Lekki Phase 1', lat: 6.4474, lng: 3.4653, radius: 0.05 },
      { name: 'Victoria Island', lat: 6.4281, lng: 3.4219, radius: 0.03 },
      { name: 'Ikeja', lat: 6.5954, lng: 3.3364, radius: 0.05 },
      { name: 'Yaba', lat: 6.5158, lng: 3.3696, radius: 0.03 },
      { name: 'Surulere', lat: 6.4969, lng: 3.3534, radius: 0.04 },
      { name: 'Ikoyi', lat: 6.4541, lng: 3.4316, radius: 0.02 },
      { name: 'Ajah', lat: 6.4698, lng: 3.5852, radius: 0.06 }
    ];

    // Find closest area
    let closestArea = 'Lagos';
    let minDistance = Infinity;
    
    for (const area of lagosAreas) {
      const distance = Math.sqrt(Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2));
      if (distance < area.radius && distance < minDistance) {
        minDistance = distance;
        closestArea = area.name;
      }
    }
    
    return `Near ${closestArea}, Lagos, Nigeria`;
  };

  const MapPreview = () => {
    if (!coordinates) {
      return (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin size={32} className="mx-auto mb-2" />
            <p>Map will appear when location is selected</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
        <iframe
          key={mapKey}
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${coordinates.lat.toFixed(6)}%2C${coordinates.lng.toFixed(6)}!5e0!3m2!1sen!2sng!4v1635959385076!5m2!1sen!2sng`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Location pin overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="w-1 h-4 bg-red-500 mx-auto"></div>
        </div>
        
        {/* Coordinates display */}
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-mono">
          {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Address Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <MapPin size={20} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Device Info */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
        {deviceType === 'mobile' ? (
          <Smartphone className="text-green-500" size={16} />
        ) : (
          <Monitor className="text-orange-500" size={16} />
        )}
        <span className="text-gray-600">
          {deviceType === 'mobile' 
            ? '📱 Mobile GPS should be accurate'
            : '💻 Desktop GPS may be inaccurate'
          }
        </span>
      </div>

      {/* Get Location Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium ${
          deviceType === 'mobile'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        } disabled:opacity-50`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Getting location...
          </>
        ) : (
          <>
            <Navigation size={16} />
            Get My Location
          </>
        )}
      </button>

      {/* Live Map Preview */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <MapPin size={16} />
          Live Map Preview
        </h4>
        <MapPreview />
        {coordinates && (
          <p className="text-xs text-gray-500 mt-2">
            📍 This is where your property will be shown to potential tenants
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationInputWithMap;