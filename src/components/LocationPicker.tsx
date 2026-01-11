import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const LocationPicker = ({ onLocationSelect, onClose, initialLocation = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Default to Lagos, Nigeria
    const defaultLocation = { lat: 6.5244, lng: 3.3792 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add marker
    markerRef.current = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstanceRef.current,
      draggable: true,
    });

    // Handle marker drag
    markerRef.current.addListener('dragend', (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      reverseGeocode(position);
    });

    // Handle map click
    mapInstanceRef.current.addListener('click', (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      markerRef.current.setPosition(position);
      reverseGeocode(position);
    });

    // Initialize autocomplete
    initializeAutocomplete();
  };

  const initializeAutocomplete = () => {
    const input = document.getElementById('location-search');
    if (!input) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'ng' }, // Restrict to Nigeria
      fields: ['place_id', 'geometry', 'name', 'formatted_address'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        mapInstanceRef.current.setCenter(position);
        markerRef.current.setPosition(position);
        
        setSelectedLocation({
          ...position,
          address: place.formatted_address,
          name: place.name,
        });
      }
    });
  };

  const reverseGeocode = (position) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setSearchQuery(address);
        setSelectedLocation({
          ...position,
          address,
          name: results[0].address_components[0]?.long_name || 'Selected Location',
        });
      }
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Select Location</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Map */}
          <div className="h-80">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">{selectedLocation.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 p-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedLocation}
              className="flex-1"
            >
              Confirm Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPicker;