import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Map } from 'lucide-react';

interface EnhancedAddressInputProps {
  value: string;
  onChange: (address: string, placeDetails?: any) => void;
  onLocationExtracted?: (locationData: any) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedAddressInput: React.FC<EnhancedAddressInputProps> = ({
  value,
  onChange,
  onLocationExtracted,
  placeholder = "Enter street address, landmark, or area",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const mapRef = useRef<any>(null);

  // Better Nigerian address suggestions using multiple APIs
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Try multiple sources for better Nigerian coverage
      const [nominatimResults, photonResults] = await Promise.allSettled([
        // Nominatim (OpenStreetMap)
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=3&countrycodes=ng&q=${encodeURIComponent(query)}`
        )}`).then(r => r.json()).then(d => JSON.parse(d.contents)),
        
        // Photon (better for African locations)
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=3&osm_tag=place&osm_tag=highway&osm_tag=amenity&bbox=2.6,4.2,14.7,13.9`)
          .then(r => r.json()).then(d => d.features || [])
      ]);

      let allSuggestions: any[] = [];

      // Process Nominatim results
      if (nominatimResults.status === 'fulfilled') {
        allSuggestions = [...allSuggestions, ...nominatimResults.value.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: item.address,
          source: 'nominatim'
        }))];
      }

      // Process Photon results (better for Nigerian locations)
      if (photonResults.status === 'fulfilled') {
        allSuggestions = [...allSuggestions, ...photonResults.value
          .filter((item: any) => item.properties.country === 'Nigeria')
          .map((item: any) => ({
            display_name: `${item.properties.name}, ${item.properties.state || item.properties.city || 'Nigeria'}`,
            lat: item.geometry.coordinates[1],
            lon: item.geometry.coordinates[0],
            address: {
              state: item.properties.state,
              city: item.properties.city,
              name: item.properties.name
            },
            source: 'photon'
          }))];
      }

      // Remove duplicates and limit to 5
      const uniqueSuggestions = allSuggestions
        .filter((item, index, self) => 
          index === self.findIndex(t => t.display_name === item.display_name)
        )
        .slice(0, 5);

      setSuggestions(uniqueSuggestions);
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
    
    if (onLocationExtracted) {
      onLocationExtracted({
        fullAddress: suggestion.display_name,
        state: suggestion.address?.state,
        city: suggestion.address?.city || suggestion.address?.town,
        area: suggestion.address?.neighbourhood || suggestion.address?.suburb,
        coordinates: { lat: suggestion.lat, lon: suggestion.lon }
      });
    }
  };

  const openMapSelector = () => {
    setShowMap(true);
    setLoading(true);
    
    // Get high-accuracy location like Uber/banks do
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          (window as any).userLocation = { lat: latitude, lng: longitude };
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to Nigeria center
          (window as any).userLocation = { lat: 9.0820, lng: 8.6753 };
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      (window as any).userLocation = { lat: 9.0820, lng: 8.6753 };
      setLoading(false);
    }
  };

  const MapModal = () => {
    useEffect(() => {
      if (showMap) {
        // Clear any existing map
        const container = document.getElementById('map-container');
        if (container) {
          container.innerHTML = '';
        }
        
        // Load Leaflet if not already loaded
        if (!(window as any).L) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = initializeMap;
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      }
    }, [showMap]);
    
    const initializeMap = () => {
      const L = (window as any).L;
      const userLoc = (window as any).userLocation || { lat: 6.5244, lng: 3.3792 };
      
      setTimeout(() => {
        // Destroy existing map if it exists
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        
        const container = document.getElementById('map-container');
        if (container && container._leaflet_id) {
          (container as any)._leaflet_id = null;
        }
        
        mapRef.current = L.map('map-container').setView([userLoc.lat, userLoc.lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        // Add user location marker with proper icon
        const userIcon = L.divIcon({
          html: '<div style="background: #4285f4; border: 3px solid white; border-radius: 50%; width: 18px; height: 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          className: 'user-location-marker',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        
        L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
          .addTo(mapRef.current)
          .bindPopup('Your current location');
        
        // Remove instruction control
        // const info = L.control({ position: 'topright' });
        // info.onAdd = function() {
        //   const div = L.DomUtil.create('div', 'info');
        //   div.innerHTML = '<div style="background:white;padding:5px;border-radius:3px;font-size:12px;">🗺️ Navigate to your area and click to select</div>';
        //   return div;
        // };
        // info.addTo(mapRef.current);
        
        let selectedMarker: any = null;
        
        mapRef.current.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          
          if (selectedMarker) mapRef.current.removeLayer(selectedMarker);
          
          const selectedIcon = L.divIcon({
            html: '<div style="background: #ea4335; border: 2px solid white; border-radius: 50% 50% 50% 0; width: 24px; height: 24px; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><div style="background: white; border-radius: 50%; width: 8px; height: 8px; margin: 6px; transform: rotate(45deg);"></div></div>',
            className: 'selected-location-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
          });
          
          selectedMarker = L.marker([lat, lng], { icon: selectedIcon }).addTo(mapRef.current);
          
          // Reverse geocode
          try {
            const response = await fetch(
              `https://api.allorigins.win/get?url=${encodeURIComponent(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
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
                  city: data.address.city || data.address.town,
                  area: data.address.neighbourhood || data.address.suburb,
                  coordinates: { lat, lon: lng }
                });
              }
              setShowMap(false);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
          }
        });
      }, 100);
    };

    if (!showMap) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl h-96">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                Select Location on Map
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                  Your location
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white transform rotate-45"></div>
                  Selected location
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div 
            id="map-container" 
            className="w-full h-80"
            style={{ height: '320px', width: '100%' }}
          ></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <>
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
          className={`w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
        
        <button
          type="button"
          onClick={openMapSelector}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs"
        >
          <Map size={14} />
          Map
        </button>
        
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                    <span className="text-xs bg-gray-100 px-1 rounded">
                      {suggestion.source}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <MapModal />
    </>
  );
};

export default EnhancedAddressInput;