import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface BasicAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

const BasicAddressInput: React.FC<BasicAddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your property address"
}) => {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Store coordinates for map viewing
          setCoordinates({ lat: latitude, lng: longitude });
          
          // Create a readable address format
          const addressString = `Property Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onChange(addressString);
          setLoading(false);
          
          // Show helpful message
          alert(`Location found! Click "View on Map" to verify it's correct, then replace with your street address.`);
        },
        (error) => {
          console.error('Location error:', error);
          let errorMessage = 'Location access denied.';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          alert(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const viewOnMap = () => {
    if (coordinates) {
      const mapUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=18`;
      window.open(mapUrl, '_blank');
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
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
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
        
        {coordinates && (
          <button
            type="button"
            onClick={viewOnMap}
            className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ExternalLink size={16} />
            View on Map
          </button>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        💡 Get location → View on map to verify → Replace with street address
      </p>
    </div>
  );
};

export default BasicAddressInput;