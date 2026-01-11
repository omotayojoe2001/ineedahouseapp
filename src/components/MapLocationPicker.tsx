import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapLocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: 6.5244, lng: 3.3792 } // Lagos default
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');

  const mapStyles = {
    height: '300px',
    width: '100%'
  };

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation({ lat, lng });
      
      // Reverse geocoding to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          onLocationSelect({ lat, lng, address: formattedAddress });
        }
      });
    }
  }, [onLocationSelect]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Click on map to select exact location</label>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={12}
          center={selectedLocation}
          onClick={onMapClick}
        >
          <Marker position={selectedLocation} />
        </GoogleMap>
      </LoadScript>
      {address && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Selected: {address}
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;