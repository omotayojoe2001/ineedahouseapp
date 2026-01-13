import React, { useState } from 'react';
import { Search, MapPin, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PropertySearchHeader = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<'where' | 'when' | 'what' | null>(null);
  const [searchData, setSearchData] = useState({
    location: '',
    availableFrom: '',
    propertyType: 'any',
    priceRange: 'any'
  });

  const suggestedDestinations = [
    {
      name: 'Nearby',
      description: 'Find what\'s around you',
      icon: <MapPin size={20} />,
      action: 'nearby'
    },
    {
      name: 'Lekki, Lagos',
      description: 'Waterfront properties',
      icon: <MapPin size={20} />,
      location: 'Lekki'
    },
    {
      name: 'Victoria Island, Lagos',
      description: 'Business district',
      icon: <MapPin size={20} />,
      location: 'Victoria Island'
    },
    {
      name: 'Ikeja, Lagos',
      description: 'Urban convenience',
      icon: <MapPin size={20} />,
      location: 'Ikeja'
    },
    {
      name: 'Abuja, FCT',
      description: 'Capital territory',
      icon: <MapPin size={20} />,
      location: 'Abuja'
    }
  ];

  const propertyTypes = [
    { id: 'any', label: 'Any Property', icon: <Home size={20} /> },
    { id: 'house-rent', label: 'House for Rent', icon: <Home size={20} /> },
    { id: 'apartment-rent', label: 'Apartment for Rent', icon: <Home size={20} /> },
    { id: 'land-rent', label: 'Land for Rent', icon: <MapPin size={20} /> },
    { id: 'house-sale', label: 'House for Sale', icon: <Home size={20} /> },
    { id: 'land-sale', label: 'Land for Sale', icon: <MapPin size={20} /> },
    { id: 'shortlet', label: 'Shortlet', icon: <Calendar size={20} /> },
    { id: 'shop-rent', label: 'Shop for Rent', icon: <Home size={20} /> },
    { id: 'event-center-rent', label: 'Event Center for Rent', icon: <Calendar size={20} /> },
    { id: 'moving-services', label: 'Moving Services', icon: <Home size={20} /> },
    { id: 'relocation-services', label: 'Relocation Services', icon: <MapPin size={20} /> }
  ];

  const priceRanges = [
    { id: 'any', label: 'Any Price' },
    { id: '0-100000', label: '₦100,000 and below' },
    { id: '100000-200000', label: '₦100,000 - ₦200,000' },
    { id: '200000-500000', label: '₦200,000 - ₦500,000' },
    { id: '500000-1000000', label: '₦500,000 - ₦1M' },
    { id: '1000000-5000000', label: '₦1M - ₦5M' },
    { id: '5000000+', label: 'Above ₦5M' }
  ];

  const handleDestinationSelect = (destination: any) => {
    if (destination.action === 'nearby') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setSearchData(prev => ({
            ...prev,
            location: `Near me (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
          }));
        });
      }
    } else {
      setSearchData(prev => ({ ...prev, location: destination.location || destination.name }));
    }
    setActiveField(null);
  };

  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    
    // Only show future dates (no backward dates)
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSearchData(prev => ({ ...prev, availableFrom: dateString }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: searchData.location,
      availableFrom: searchData.availableFrom,
      propertyType: searchData.propertyType,
      priceRange: searchData.priceRange
    });
    
    navigate(`/search-results?${params.toString()}`);
    setActiveField(null);
  };

  return (
    <div className="relative bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-full border border-gray-300 shadow-lg p-2 flex items-center">
          {/* Where */}
          <div 
            className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition-all ${
              activeField === 'where' ? 'bg-white shadow-lg' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveField(activeField === 'where' ? null : 'where')}
          >
            <div className="text-xs font-semibold text-gray-900">Where</div>
            <div className="text-sm text-gray-500">
              {searchData.location || 'Search locations'}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* When */}
          <div 
            className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition-all ${
              activeField === 'when' ? 'bg-white shadow-lg' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveField(activeField === 'when' ? null : 'when')}
          >
            <div className="text-xs font-semibold text-gray-900">When</div>
            <div className="text-sm text-gray-500">
              {searchData.availableFrom || 'Available from'}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* What */}
          <div 
            className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition-all ${
              activeField === 'what' ? 'bg-white shadow-lg' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveField(activeField === 'what' ? null : 'what')}
          >
            <div className="text-xs font-semibold text-gray-900">What</div>
            <div className="text-sm text-gray-500">
              {propertyTypes.find(t => t.id === searchData.propertyType)?.label || 'Property type'}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded-full ml-2 transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Dropdown Panels */}
      {activeField && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 z-50 max-w-4xl mx-auto">
          
          {/* Where Panel */}
          {activeField === 'where' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Where do you want to find property?</h3>
              
              {/* Location Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search cities, states, or areas..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  onChange={(e) => {
                    setSearchData(prev => ({ ...prev, location: e.target.value }));
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {suggestedDestinations.map((dest, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleDestinationSelect(dest);
                      setActiveField(null); // Auto-close after selection
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="text-gray-600">{dest.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{dest.name}</div>
                      <div className="text-sm text-gray-500">{dest.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveField(null)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* When Panel */}
          {activeField === 'when' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">When do you need it?</h3>
              
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => {
                    const prevMonth = new Date();
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <h4 className="text-lg font-semibold">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  onClick={() => {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendar().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 text-sm rounded-lg transition-colors ${
                      date.toISOString().split('T')[0] === searchData.availableFrom
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* What Panel */}
          {activeField === 'what' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">What type of property?</h3>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSearchData(prev => ({ ...prev, propertyType: type.id }));
                      // Don't auto-close, let user select price range too
                    }}
                    className={`p-3 rounded-lg border text-left transition-colors flex items-center gap-3 ${
                      searchData.propertyType === type.id
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={searchData.propertyType === type.id ? 'text-white' : 'text-gray-600'}>
                      {type.icon}
                    </div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSearchData(prev => ({ ...prev, priceRange: range.id }))}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        searchData.priceRange === range.id
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveField(null)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {activeField && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setActiveField(null)}
        />
      )}
    </div>
  );
};

export default PropertySearchHeader;