import React, { useState, useEffect } from 'react';
import { LocationService, State, City, Area, Street } from '../services/locationService';
import { Plus } from 'lucide-react';

interface EnhancedLocationInputProps {
  onLocationChange: (locationData: {
    stateId: string;
    cityId: string;
    areaId: string;
    streetId?: string;
    detailedAddress: string;
    landmarks: string;
  }) => void;
  initialData?: {
    stateId?: string;
    cityId?: string;
    areaId?: string;
    streetId?: string;
    detailedAddress?: string;
    landmarks?: string;
  };
}

const EnhancedLocationInput: React.FC<EnhancedLocationInputProps> = ({
  onLocationChange,
  initialData
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);
  
  const [selectedState, setSelectedState] = useState(initialData?.stateId || '');
  const [selectedCity, setSelectedCity] = useState(initialData?.cityId || '');
  const [selectedArea, setSelectedArea] = useState(initialData?.areaId || '');
  const [selectedStreet, setSelectedStreet] = useState(initialData?.streetId || '');
  const [detailedAddress, setDetailedAddress] = useState(initialData?.detailedAddress || '');
  const [landmarks, setLandmarks] = useState(initialData?.landmarks || '');
  
  const [newCity, setNewCity] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);
  const [showAddStreet, setShowAddStreet] = useState(false);

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState);
      setSelectedCity('');
      setSelectedArea('');
      setSelectedStreet('');
    }
  }, [selectedState]);

  // Load areas when city changes
  useEffect(() => {
    if (selectedCity) {
      loadAreas(selectedCity);
      setSelectedArea('');
      setSelectedStreet('');
    }
  }, [selectedCity]);

  // Load streets when area changes
  useEffect(() => {
    if (selectedArea) {
      loadStreets(selectedArea);
      setSelectedStreet('');
    }
  }, [selectedArea]);

  // Notify parent of changes
  useEffect(() => {
    // Always notify if we have at least state, city, and area selected
    // OR if we have detailedAddress or landmarks filled
    if ((selectedState && selectedCity && selectedArea) || detailedAddress || landmarks) {
      onLocationChange({
        stateId: selectedState,
        cityId: selectedCity,
        areaId: selectedArea,
        streetId: selectedStreet,
        detailedAddress,
        landmarks
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity, selectedArea, selectedStreet, detailedAddress, landmarks]);

  const loadStates = async () => {
    try {
      const data = await LocationService.getStates();
      setStates(data);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadCities = async (stateId: string) => {
    try {
      const data = await LocationService.getCitiesByState(stateId);
      setCities(data);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const loadAreas = async (cityId: string) => {
    try {
      const data = await LocationService.getAreasByCity(cityId);
      setAreas(data);
    } catch (error) {
      console.error('Error loading areas:', error);
    }
  };

  const loadStreets = async (areaId: string) => {
    try {
      const data = await LocationService.getStreetsByArea(areaId);
      setStreets(data);
    } catch (error) {
      console.error('Error loading streets:', error);
    }
  };

  const handleAddCity = async () => {
    if (!newCity.trim() || !selectedState) return;
    
    try {
      const city = await LocationService.addCity(newCity.trim(), selectedState);
      setCities(prev => [...prev, city]);
      setSelectedCity(city.id);
      setNewCity('');
      setShowAddCity(false);
    } catch (error: any) {
      // If duplicate, find and select existing city
      if (error?.code === '23505') {
        const existing = cities.find(c => c.name.toLowerCase() === newCity.trim().toLowerCase());
        if (existing) {
          setSelectedCity(existing.id);
          setNewCity('');
          setShowAddCity(false);
        }
      } else {
        console.error('Error adding city:', error);
      }
    }
  };

  const handleAddArea = async () => {
    if (!newArea.trim() || !selectedCity) return;
    
    try {
      const area = await LocationService.addArea(newArea.trim(), selectedCity);
      setAreas(prev => [...prev, area]);
      setSelectedArea(area.id);
      setNewArea('');
      setShowAddArea(false);
    } catch (error: any) {
      // If duplicate, find and select existing area
      if (error?.code === '23505') {
        const existing = areas.find(a => a.name.toLowerCase() === newArea.trim().toLowerCase());
        if (existing) {
          setSelectedArea(existing.id);
          setNewArea('');
          setShowAddArea(false);
        } else {
          // Reload areas to get the existing one
          await loadAreas(selectedCity);
          const reloaded = await LocationService.getAreasByCity(selectedCity);
          const found = reloaded.find(a => a.name.toLowerCase() === newArea.trim().toLowerCase());
          if (found) {
            setAreas(reloaded);
            setSelectedArea(found.id);
            setNewArea('');
            setShowAddArea(false);
          }
        }
      } else {
        console.error('Error adding area:', error);
      }
    }
  };

  const handleAddStreet = async () => {
    if (!newStreet.trim() || !selectedArea) return;
    
    try {
      const street = await LocationService.addStreet(newStreet.trim(), selectedArea);
      setStreets(prev => [...prev, street]);
      setSelectedStreet(street.id);
      setNewStreet('');
      setShowAddStreet(false);
    } catch (error: any) {
      // If duplicate, find and select existing street
      if (error?.code === '23505') {
        const existing = streets.find(s => s.name.toLowerCase() === newStreet.trim().toLowerCase());
        if (existing) {
          setSelectedStreet(existing.id);
          setNewStreet('');
          setShowAddStreet(false);
        }
      } else {
        console.error('Error adding street:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* State Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">State *</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg"
          required
        >
          <option value="">Choose state</option>
          {states.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>

      {/* City Selection */}
      {selectedState && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">City/LGA *</label>
            <button
              type="button"
              onClick={() => setShowAddCity(!showAddCity)}
              className="text-primary text-sm flex items-center gap-1"
            >
              <Plus size={14} /> Add New
            </button>
          </div>
          
          {showAddCity && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Enter new city name"
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          )}
          
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
            required
          >
            <option value="">Choose city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Area Selection */}
      {selectedCity && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Area *</label>
            <button
              type="button"
              onClick={() => setShowAddArea(!showAddArea)}
              className="text-primary text-sm flex items-center gap-1"
            >
              <Plus size={14} /> Add New
            </button>
          </div>
          
          {showAddArea && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Enter new area name"
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          )}
          
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
            required
          >
            <option value="">Choose area</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Street Selection */}
      {selectedArea && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Street (Optional)</label>
            <button
              type="button"
              onClick={() => setShowAddStreet(!showAddStreet)}
              className="text-primary text-sm flex items-center gap-1"
            >
              <Plus size={14} /> Add New
            </button>
          </div>
          
          {showAddStreet && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="Enter new street name"
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddStreet}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          )}
          
          <select
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          >
            <option value="">Choose street (optional)</option>
            {streets.map(street => (
              <option key={street.id} value={street.id}>{street.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Detailed Address */}
      {selectedArea && (
        <div>
          <label className="block text-sm font-medium mb-2">House Number & Detailed Address</label>
          <input
            type="text"
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
            placeholder="e.g., No. 18, Block A, Estate Name"
          />
        </div>
      )}

      {/* Landmarks */}
      {selectedArea && (
        <div>
          <label className="block text-sm font-medium mb-2">Nearby Landmarks</label>
          <textarea
            value={landmarks}
            onChange={(e) => setLandmarks(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg h-20"
            placeholder="e.g., 5 minutes from Lekki Phase 1 Roundabout, Close to The Palms Shopping Mall"
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationInput;