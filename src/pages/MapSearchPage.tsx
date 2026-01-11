import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AirbnbSearch from '../components/AirbnbSearch';
import { MapPin, Heart, Star, Filter } from 'lucide-react';

const MapSearchPage = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 6.5244, lng: 3.3792 }); // Lagos
  const [showMap, setShowMap] = useState(true);

  // Mock property data
  const mockProperties = [
    {
      id: 1,
      title: '3 Bedroom Apartment in Lekki',
      price: '₦150,000/month',
      rating: 4.8,
      reviews: 24,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      coordinates: { lat: 6.4474, lng: 3.4653 },
      type: 'apartment'
    },
    {
      id: 2,
      title: 'Modern 2 Bedroom in Victoria Island',
      price: '₦200,000/month',
      rating: 4.9,
      reviews: 18,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      coordinates: { lat: 6.4281, lng: 3.4219 },
      type: 'apartment'
    },
    {
      id: 3,
      title: 'Luxury Duplex in Ikeja GRA',
      price: '₦300,000/month',
      rating: 4.7,
      reviews: 31,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      coordinates: { lat: 6.5954, lng: 3.3364 },
      type: 'house'
    },
    {
      id: 4,
      title: 'Shortlet Apartment in Ikoyi',
      price: '₦25,000/night',
      rating: 4.6,
      reviews: 12,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      coordinates: { lat: 6.4698, lng: 3.4343 },
      type: 'shortlet'
    }
  ];

  const handleSearch = (searchData: any) => {
    console.log('Search data:', searchData);
    // Filter properties based on search
    let filtered = mockProperties;
    
    if (searchData.propertyType !== 'any') {
      filtered = filtered.filter(p => p.type === searchData.propertyType);
    }
    
    setSearchResults(filtered);
    
    // Update map center based on destination
    if (searchData.destination.includes('Lekki')) {
      setMapCenter({ lat: 6.4474, lng: 3.4653 });
    } else if (searchData.destination.includes('Victoria Island')) {
      setMapCenter({ lat: 6.4281, lng: 3.4219 });
    } else if (searchData.destination.includes('Ikeja')) {
      setMapCenter({ lat: 6.5954, lng: 3.3364 });
    }
  };

  useEffect(() => {
    // Initialize with all properties
    setSearchResults(mockProperties);
  }, []);

  const MapView = () => (
    <div className="h-full bg-gray-200 rounded-lg relative overflow-hidden">
      {/* Embedded Google Maps */}
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzEnMjcuOCJOIDPCsDIyJzU3LjEiRQ!5e0!3m2!1sen!2sng!4v1635959385076!5m2!1sen!2sng`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Property pins overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {searchResults.map((property) => (
          <div
            key={property.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${((property.coordinates.lng - mapCenter.lng + 0.1) / 0.2) * 100}%`,
              top: `${((mapCenter.lat - property.coordinates.lat + 0.1) / 0.2) * 100}%`
            }}
          >
            <div className="bg-white px-3 py-1 rounded-full shadow-lg border-2 border-red-500 text-sm font-semibold hover:scale-110 transition-transform cursor-pointer">
              {property.price.split('/')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout activeTab="explore">
      <div className="h-screen flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b bg-white">
          <AirbnbSearch onSearch={handleSearch} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Results Panel */}
          <div className="w-1/2 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {searchResults.length} properties found
              </h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                  Filters
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 lg:hidden"
                >
                  {showMap ? 'Show List' : 'Show Map'}
                </button>
              </div>
            </div>

            {searchResults.map((property) => (
              <div key={property.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex gap-4 p-4">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-64 h-48 object-cover rounded-lg"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-current text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-gray-500">({property.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin size={14} />
                      <span className="text-sm">Lagos, Nigeria</span>
                    </div>
                    
                    <div className="text-gray-600 text-sm mb-4">
                      Available now • Fully furnished • 24/7 security
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold">{property.price}</span>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Panel */}
          <div className={`w-1/2 ${showMap ? 'block' : 'hidden lg:block'}`}>
            <MapView />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapSearchPage;