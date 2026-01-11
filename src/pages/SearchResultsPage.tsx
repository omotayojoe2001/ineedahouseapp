import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Home } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const location = searchParams.get('location') || '';
  const availableFrom = searchParams.get('availableFrom') || '';
  const propertyType = searchParams.get('propertyType') || 'any';
  const priceRange = searchParams.get('priceRange') || 'any';

  useEffect(() => {
    const searchProperties = async () => {
      setLoading(true);
      setNoResults(false);

      try {
        // Start with ALL active properties
        let { data, error } = await supabase
          .from('properties')
          .select('*, property_images(image_url, is_primary)')
          .eq('status', 'active');

        if (error) throw error;

        let filteredData = data || [];

        // Filter by location (simple includes)
        if (location && location !== '') {
          filteredData = filteredData.filter(prop => 
            prop.location?.toLowerCase().includes(location.toLowerCase()) ||
            prop.title?.toLowerCase().includes(location.toLowerCase())
          );
        }

        // Filter by property type
        if (propertyType !== 'any') {
          if (propertyType.includes('rent')) {
            filteredData = filteredData.filter(prop => prop.category === 'rent');
          } else if (propertyType.includes('sale')) {
            filteredData = filteredData.filter(prop => prop.category === 'sale' || prop.category === 'land');
          }
        }

        console.log('Final filtered results:', filteredData);
        setProperties(filteredData);
        setNoResults(filteredData.length === 0);
      } catch (error) {
        console.error('Error searching properties:', error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    searchProperties();
  }, [location, availableFrom, propertyType, priceRange]);

  const NoResultsMessage = () => (
    <div className="text-center py-20">
      <div className="mb-6">
        <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No properties found in {location}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find any {propertyType !== 'any' ? propertyType.replace('-', ' ') : 'properties'} 
          {location ? ` in ${location}` : ''} 
          {availableFrom ? ` available from ${availableFrom}` : ''}.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Try searching for a nearby area</p>
          <p>• Check if the location name is spelled correctly</p>
          <p>• Try a different property type</p>
          <p>• Adjust your price range or availability date</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout activeTab="explore">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p>Searching properties in {location}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="explore">
      <div className="p-4">
        {/* Search Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h1 className="text-xl font-bold mb-2">Search Results</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>Location: {location}</span>
              </div>
            )}
            {availableFrom && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Available from: {availableFrom}</span>
              </div>
            )}
            {propertyType !== 'any' && (
              <div className="flex items-center gap-1">
                <Home size={14} />
                <span>Type: {propertyType.replace('-', ' ')}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {/* Results */}
        {noResults ? (
          <NoResultsMessage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
                <img
                  src={property.property_images?.find((img: any) => img.is_primary)?.image_url || 
                       property.property_images?.[0]?.image_url || 
                       'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {property.category === 'rent' ? 'For Rent' : 
                       property.category === 'sale' ? 'For Sale' : 
                       property.category === 'land' ? 'Land for Sale' :
                       property.category === 'shortlet' ? 'Shortlet' :
                       property.category === 'shop' ? 'Shop/Office' :
                       property.category === 'event_center' ? 'Event Center' :
                       property.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">₦{property.price?.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/{property.category === 'rent' ? 'month' : 'total'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;