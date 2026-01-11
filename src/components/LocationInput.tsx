import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationPicker from './LocationPicker';

const LocationInput = ({ 
  label = "Location", 
  placeholder = "Enter location...", 
  value = "", 
  onChange, 
  required = false 
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const handleLocationSelect = (location) => {
    setLocationData(location);
    onChange(location.address);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <Label>{label} {required && '*'}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowLocationPicker(true)}
          className="px-3"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
          initialLocation={value}
        />
      )}
    </div>
  );
};

export default LocationInput;