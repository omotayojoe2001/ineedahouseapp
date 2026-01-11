import React, { useState } from 'react';
import { MapPin, Map } from 'lucide-react';

interface SimpleMapInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

const SimpleMapInput: React.FC<SimpleMapInputProps> = ({
  value,
  onChange,
  placeholder = "Enter address or click map to select"
}) => {
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const openMap = () => {
    setShowMap(true);
  };

  const MapModal = () => {
    if (!showMap) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-96">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Select Your Location</h3>
            <button
              onClick={() => setShowMap(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316952784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1635959385076!5m2!1sen!2sng"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="p-4 bg-gray-50 text-sm text-gray-600">
            <p>📍 Navigate to your location on the map above, then manually enter the address below</p>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use Google's reverse geocoding
            const response = await fetch(
              `https://api.allorigins.win/get?url=${encodeURIComponent(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
              )}`
            );
            const data = await response.json();
            const result = JSON.parse(data.contents);
            
            if (result.display_name) {
              onChange(result.display_name);
            } else {
              onChange(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            onChange(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          alert('Location access denied. Please enable location services and try again.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  return (
    <>
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <MapPin size={16} />
            )}
            {loading ? 'Getting location...' : 'Use My Location'}
          </button>
          
          <button
            type="button"
            onClick={openMap}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Map size={16} />
            View Map
          </button>
        </div>
      </div>
      
      <MapModal />
    </>
  );
};

export default SimpleMapInput;