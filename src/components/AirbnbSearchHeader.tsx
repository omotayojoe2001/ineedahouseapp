import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AirbnbSearchHeader = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<'where' | 'when' | 'who' | null>(null);
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    propertyType: 'any'
  });

  const suggestedDestinations = [
    {
      name: 'Nearby',
      description: 'Find what\'s around you',
      icon: '📍',
      action: 'nearby'
    },
    {
      name: 'Lekki, Lagos',
      description: 'For its seaside allure',
      icon: '🏖️',
      location: 'Lekki, Lagos State, Nigeria'
    },
    {
      name: 'Victoria Island, Lagos',
      description: 'For business and luxury',
      icon: '🏢',
      location: 'Victoria Island, Lagos State, Nigeria'
    },
    {
      name: 'Ikeja, Lagos',
      description: 'For urban convenience',
      icon: '🏙️',
      location: 'Ikeja, Lagos State, Nigeria'
    },
    {
      name: 'Abuja, FCT',
      description: 'For the capital experience',
      icon: '🏛️',
      location: 'Abuja, Federal Capital Territory, Nigeria'
    }
  ];

  const propertyTypes = [
    { id: 'any', label: 'Any type', icon: '🏠' },
    { id: 'apartment', label: 'Apartment', icon: '🏢' },
    { id: 'house', label: 'House', icon: '🏡' },
    { id: 'shortlet', label: 'Shortlet', icon: '🏨' },
    { id: 'land', label: 'Land', icon: '🌍' }
  ];

  const handleDestinationSelect = (destination: any) => {
    if (destination.action === 'nearby') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setSearchData(prev => ({
            ...prev,
            destination: `Near me (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
          }));
        });
      }
    } else {
      setSearchData(prev => ({ ...prev, destination: destination.location }));
    }
    setActiveField(null);
  };

  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const handleDateSelect = (date: Date, type: 'checkIn' | 'checkOut') => {
    const dateString = date.toISOString().split('T')[0];
    setSearchData(prev => ({ ...prev, [type]: dateString }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString(),
      propertyType: searchData.propertyType
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
              {searchData.destination || 'Search destinations'}
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
              {searchData.checkIn ? `${searchData.checkIn} - ${searchData.checkOut || 'Add date'}` : 'Add dates'}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* Who */}
          <div 
            className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition-all ${
              activeField === 'who' ? 'bg-white shadow-lg' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveField(activeField === 'who' ? null : 'who')}
          >
            <div className="text-xs font-semibold text-gray-900">Who</div>
            <div className="text-sm text-gray-500">
              {searchData.guests > 1 ? `${searchData.guests} guests` : 'Add guests'}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full ml-2 transition-colors"
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
              <h3 className="text-lg font-semibold mb-6">Suggested destinations</h3>
              <div className="grid grid-cols-1 gap-4">
                {suggestedDestinations.map((dest, index) => (
                  <button
                    key={index}
                    onClick={() => handleDestinationSelect(dest)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="text-2xl">{dest.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{dest.name}</div>
                      <div className="text-sm text-gray-500">{dest.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Property Type</h4>
                <div className="flex gap-2 flex-wrap">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSearchData(prev => ({ ...prev, propertyType: type.id }))}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                        searchData.propertyType === type.id
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* When Panel */}
          {activeField === 'when' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Select dates</h3>
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
                    onClick={() => {
                      if (!searchData.checkIn) {
                        handleDateSelect(date, 'checkIn');
                      } else if (!searchData.checkOut) {
                        handleDateSelect(date, 'checkOut');
                      } else {
                        setSearchData(prev => ({ ...prev, checkIn: '', checkOut: '' }));
                        handleDateSelect(date, 'checkIn');
                      }
                    }}
                    className={`p-2 text-sm rounded-lg transition-colors ${
                      date.toISOString().split('T')[0] === searchData.checkIn ||
                      date.toISOString().split('T')[0] === searchData.checkOut
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Who Panel */}
          {activeField === 'who' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Add guests</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Guests</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSearchData(prev => ({ 
                      ...prev, 
                      guests: Math.max(1, prev.guests - 1) 
                    }))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{searchData.guests}</span>
                  <button
                    onClick={() => setSearchData(prev => ({ 
                      ...prev, 
                      guests: prev.guests + 1 
                    }))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
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

export default AirbnbSearchHeader;