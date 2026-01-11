import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Smartphone, Monitor } from 'lucide-react';

interface SmartLocationInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

const SmartLocationInput: React.FC<SmartLocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your property address"
}) => {
  const [loading, setLoading] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      const options = deviceType === 'mobile' 
        ? {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        : {
            enableHighAccuracy: false, // Desktop GPS is usually inaccurate anyway
            timeout: 5000,
            maximumAge: 300000 // Use cached location on desktop
          };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const accuracy = position.coords.accuracy;
          
          if (deviceType === 'mobile' && accuracy > 100) {
            alert(`Location found but accuracy is low (±${accuracy}m). Try moving to an open area for better GPS signal.`);
          }
          
          const addressString = `GPS Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onChange(addressString);
          setLoading(false);
          
          // Different messages for mobile vs desktop
          if (deviceType === 'mobile') {
            alert(`✅ Mobile GPS location captured! Accuracy: ±${accuracy}m\n\nNow replace with your street address like:\n"14 Hassan Street, Oshodi, Lagos"`);
          } else {
            alert(`⚠️ Desktop location may be inaccurate (±${accuracy}m)\n\nFor better accuracy:\n1. Use your phone instead\n2. Or manually enter your address`);
          }
        },
        (error) => {
          console.error('Location error:', error);
          let errorMessage = '';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = deviceType === 'mobile' 
                ? 'Location access denied. Please enable location services in your phone settings.'
                : 'Location access denied. Desktop location is often inaccurate anyway - try entering your address manually.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable. Try moving to an area with better signal.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          alert(errorMessage);
          setLoading(false);
        },
        options
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
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
      
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        {deviceType === 'mobile' ? (
          <Smartphone className="text-green-500" size={16} />
        ) : (
          <Monitor className="text-orange-500" size={16} />
        )}
        <span className="text-sm text-gray-600">
          {deviceType === 'mobile' 
            ? '📱 Mobile device detected - GPS should be accurate'
            : '💻 Desktop detected - GPS may be inaccurate, consider using mobile'
          }
        </span>
      </div>
      
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
            {deviceType === 'mobile' ? 'Get My Location (Accurate)' : 'Get My Location (May be inaccurate)'}
          </>
        )}
      </button>
      
      {deviceType === 'desktop' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> For accurate location, open this page on your phone instead. Desktop GPS uses WiFi/IP location which can be kilometers off.
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartLocationInput;