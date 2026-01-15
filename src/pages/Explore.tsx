import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertySearchHeader from '../components/PropertySearchHeader';
import PropertySection from '../components/PropertySection';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyService } from '../services/propertyService';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [shortlets, setShortlets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{state: string, lga?: string} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Request user location on mount
  useEffect(() => {
    const requestLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setLocationPermission('granted');
          
          // Use Google Geocoding API to get location name from coordinates
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
              const addressComponents = data.results[0].address_components;
              const state = addressComponents.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || 'Lagos';
              const lga = addressComponents.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name;
              
              setUserLocation({ state, lga });
            } else {
              setUserLocation({ state: 'Lagos', lga: 'Ikeja' });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            setUserLocation({ state: 'Lagos', lga: 'Ikeja' });
          }
        } catch (error) {
          setLocationPermission('denied');
        }
      }
    };
    requestLocation();
  }, []);

  // Fetch properties and shortlets from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make all queries in parallel with limits for better performance
        const [propertiesRes, salePropertiesRes, shortletsRes, servicesRes, shopsRes, eventCentersRes] = await Promise.allSettled([
          supabase.from('properties').select('id, title, price, location, category, property_type, images, featured, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('sale_properties').select('id, title, sale_price, location, property_type, images, featured, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('shortlets').select('id, title, daily_rate, location, images, featured, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('services').select('id, title, pricing, location, service_type, images, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('shops').select('id, title, monthly_rent, location, images, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('event_centers').select('id, title, daily_rate, location, images, created_at').order('created_at', { ascending: false }).limit(20)
        ]);

        const allProperties: any[] = [];
        const allShortlets: any[] = [];
        const allServices: any[] = [];

        // Process properties
        if (propertiesRes.status === 'fulfilled' && propertiesRes.value.data) {
          allProperties.push(...propertiesRes.value.data);
        }

        // Process sale properties
        if (salePropertiesRes.status === 'fulfilled' && salePropertiesRes.value.data) {
          const transformed = salePropertiesRes.value.data.map(prop => ({
            ...prop,
            price: prop.sale_price,
            category: 'sale',
            property_type: prop.property_type || 'land'
          }));
          allProperties.push(...transformed);
        }

        // Process shortlets
        if (shortletsRes.status === 'fulfilled' && shortletsRes.value.data) {
          allShortlets.push(...shortletsRes.value.data);
        }

        // Process services
        if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
          const transformed = servicesRes.value.data.map(service => ({
            ...service,
            price: service.pricing
          }));
          allServices.push(...transformed);
        }

        // Process shops
        if (shopsRes.status === 'fulfilled' && shopsRes.value.data) {
          const transformed = shopsRes.value.data.map(shop => ({
            ...shop,
            price: shop.monthly_rent,
            category: 'shop'
          }));
          allProperties.push(...transformed);
        }

        // Process event centers
        if (eventCentersRes.status === 'fulfilled' && eventCentersRes.value.data) {
          const transformed = eventCentersRes.value.data.map(event => ({
            ...event,
            price: event.daily_rate,
            category: 'event_center'
          }));
          allProperties.push(...transformed);
        }

        setProperties(allProperties);
        setShortlets(allShortlets);
        setServices(allServices);
        console.log('📊 TOTAL LISTINGS:', {
          properties: allProperties.length,
          shortlets: allShortlets.length,
          services: allServices.length,
          total: allProperties.length + allShortlets.length + allServices.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseNaturalLanguageSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filters: any = {};
    
    // Extract location - more flexible matching
    const locations = ['lagos', 'abuja', 'port harcourt', 'kano', 'ibadan', 'benin', 'jos', 'kaduna', 'enugu', 'onitsha', 'yaba', 'lekki', 'ikeja', 'victoria island', 'maitama', 'garki', 'wuse', 'asokoro', 'ikoyi', 'gwarinpa', 'jahi'];
    const foundLocation = locations.find(loc => lowerQuery.includes(loc));
    if (foundLocation) {
      filters.location = foundLocation;
    }
    
    // Extract property type
    if (lowerQuery.includes('self contain') || lowerQuery.includes('self-contain')) {
      filters.category = 'rent';
      filters.propertyType = 'apartment';
    } else if (lowerQuery.includes('flat') || lowerQuery.includes('apartment')) {
      filters.category = 'rent';
      filters.propertyType = 'apartment';
    } else if (lowerQuery.includes('house') || lowerQuery.includes('duplex')) {
      filters.category = 'rent';
      filters.propertyType = 'house';
    } else if (lowerQuery.includes('land') || lowerQuery.includes('plot')) {
      filters.category = 'sale';
      filters.propertyType = 'land';
    } else if (lowerQuery.includes('shop') || lowerQuery.includes('store')) {
      filters.category = 'shop';
    } else if (lowerQuery.includes('shortlet') || lowerQuery.includes('short let')) {
      filters.category = 'shortlet';
    }
    
    // Extract bedrooms
    const bedroomMatch = lowerQuery.match(/(\d+)\s*bedroom/);
    if (bedroomMatch) {
      filters.bedrooms = bedroomMatch[1];
    }
    
    // Extract bathrooms
    const bathroomMatch = lowerQuery.match(/(\d+)\s*bathroom/);
    if (bathroomMatch) {
      filters.bathrooms = bathroomMatch[1];
    }
    
    return filters;
  };

  const handleSearch = (query: string | any) => {
    console.log('Search received in Explore:', query);
    
    // If it's a text search, parse natural language
    if (typeof query === 'string' && query.trim()) {
      const parsedFilters = parseNaturalLanguageSearch(query);
      console.log('Parsed filters:', parsedFilters);
      setSearchQuery(query);
    } else {
      // Regular filter object or empty search
      setSearchQuery(query);
    }
  };

  // Transform database properties to component format
  const transformProperty = (prop: any) => {
    const imageUrl = prop.images?.[0] || 
                    prop.property_images?.find((img: any) => img.is_primary)?.image_url || 
                    prop.property_images?.[0]?.image_url ||
                    '/placeholder.svg'; // Always provide fallback
    
    return {
      id: prop.id,
      title: prop.title,
      price: Number(prop.price) || 0,
      duration: prop.duration || (prop.category === 'rent' ? '/ month' : ' total'),
      rating: prop.rating || 4.5,
      imageUrl: imageUrl,
      location: prop.location,
      badge: prop.featured ? 'Featured' : undefined,
    };
  };

  const popularLagosProperties = loading ? [] : properties
    .filter(prop => prop.location?.toLowerCase().includes('lagos') && prop.category === 'rent')
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(transformProperty);

  const nextMonthAbuja = loading ? [] : properties
    .filter(prop => prop.location?.toLowerCase().includes('abuja') && prop.category === 'rent')
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(transformProperty);

  const nearbyProperties = loading || !userLocation ? [] : properties
    .filter(prop => {
      const propLocation = prop.location?.toLowerCase() || '';
      return propLocation.includes(userLocation.state.toLowerCase()) || 
             (userLocation.lga && propLocation.includes(userLocation.lga.toLowerCase()));
    })
    .slice(0, 4)
    .map(transformProperty);

  const propertiesForSale = loading ? [] : properties
    .filter(prop => prop.category === 'sale' && prop.property_type !== 'land')
    .slice(0, 4)
    .map(transformProperty);

  const landForSale = loading ? [] : properties
    .filter(prop => prop.category === 'sale' && prop.property_type === 'land')
    .slice(0, 4)
    .map(transformProperty);

  const recentShortletListings = loading ? [] : shortlets
    .slice(0, 4)
    .map(shortlet => ({
      id: shortlet.id,
      title: shortlet.title,
      price: shortlet.daily_rate,
      duration: '/ day',
      rating: shortlet.rating || 4.5,
      imageUrl: shortlet.images?.[0] || '/placeholder.svg',
      location: shortlet.location,
      badge: shortlet.featured ? 'Featured' : undefined,
    }));

  const relocationServices = loading ? [] : services
    .filter(service => service.service_type?.toLowerCase().includes('relocation'))
    .slice(0, 4)
    .map(service => ({
      id: service.id,
      title: service.title,
      price: service.price,
      duration: ' per service',
      rating: service.rating || 4.5,
      imageUrl: service.images?.[0] || property1,
      location: service.location,
    }));

  const otherServices = loading ? [] : services
    .filter(service => !service.service_type?.toLowerCase().includes('relocation'))
    .slice(0, 4)
    .map(service => ({
      id: service.id,
      title: service.title,
      price: service.price,
      duration: ' per service',
      rating: service.rating || 4.5,
      imageUrl: service.images?.[0] || property1,
      location: service.location,
    }));

  const recentRentListings = loading ? [] : properties
    .filter(prop => prop.category === 'rent')
    .slice(0, 4)
    .map(transformProperty);

  const recentSaleListings = loading ? [] : properties
    .filter(prop => prop.category === 'sale' && prop.property_type !== 'land')
    .slice(0, 4)
    .map(transformProperty);

  const featuredProperties = loading ? [] : properties
    .filter(prop => prop.featured)
    .slice(0, 2)
    .map(prop => {
      const imageUrl = prop.images?.[0] || 
                      prop.property_images?.find((img: any) => img.is_primary)?.image_url || 
                      prop.property_images?.[0]?.image_url;
      
      if (!imageUrl) return null;
      
      return {
        id: prop.id,
        title: prop.title,
        location: prop.location,
        price: prop.price,
        duration: prop.category === 'rent' ? 'month' as const : 'total' as const,
        imageUrl: imageUrl,
        rating: prop.rating || 4.5,
        isSponsored: prop.featured,
        sponsorName: 'Premium Homes',
      };
    })
    .filter(Boolean);

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleShortletClick = (property: any) => {
    navigate(`/shortlet/${property.id}`);
  };

  const handleFavoriteToggle = async (propertyId: string) => {
    try {
      // Determine listing type based on category
      const allItems = [...properties, ...shortlets, ...services];
      const item = allItems.find(p => p.id === propertyId);
      
      let listingType: 'property' | 'sale_property' | 'shortlet' | 'shop' | 'event_center' | 'service' = 'property';
      if (item?.category === 'sale') listingType = 'sale_property';
      else if (item?.category === 'shortlet') listingType = 'shortlet';
      else if (item?.category === 'shop') listingType = 'shop';
      else if (item?.category === 'event_center') listingType = 'event_center';
      else if (item?.category === 'service') listingType = 'service';
      
      const isAdding = await PropertyService.toggleFavorite(propertyId, listingType);
      
      const newFavorites = new Set(favorites);
      if (isAdding) {
        newFavorites.add(propertyId);
      } else {
        newFavorites.delete(propertyId);
      }
      setFavorites(newFavorites);
      
      toast({
        title: isAdding ? "Property Saved!" : "Property Removed",
        description: isAdding ? "Added to your saved properties" : "Removed from your saved properties",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Please sign in to save properties",
        variant: "destructive",
      });
    }
  };

  // Filter properties based on search
  const filterProperties = (properties: any[]) => {
    if (!searchQuery) return properties;
    
    // If it's a string query, use natural language parsing
    if (typeof searchQuery === 'string') {
      const parsedFilters = parseNaturalLanguageSearch(searchQuery);
      const lowerQuery = searchQuery.toLowerCase();
      
      return properties.filter(prop => {
        // Basic text match in title or location
        const basicTextMatch = (prop.title && prop.title.toLowerCase().includes(lowerQuery)) ||
          (prop.location && prop.location.toLowerCase().includes(lowerQuery));
        
        // If basic text matches, include it
        if (basicTextMatch) return true;
        
        // Check individual words in the search query
        const searchWords = lowerQuery.split(' ').filter(word => word.length > 2);
        const hasWordMatch = searchWords.some(word => 
          (prop.title && prop.title.toLowerCase().includes(word)) ||
          (prop.location && prop.location.toLowerCase().includes(word))
        );
        
        if (hasWordMatch) {
          // Additional filtering based on parsed filters
          if (parsedFilters.location) {
            const locationMatch = (prop.title && prop.title.toLowerCase().includes(parsedFilters.location)) ||
              (prop.location && prop.location.toLowerCase().includes(parsedFilters.location));
            if (!locationMatch) return false;
          }
          
          if (parsedFilters.propertyType) {
            const typeMatch = (prop.title && prop.title.toLowerCase().includes(parsedFilters.propertyType)) ||
              (parsedFilters.propertyType === 'apartment' && prop.title && (prop.title.toLowerCase().includes('room') || prop.title.toLowerCase().includes('flat') || prop.title.toLowerCase().includes('apartment'))) ||
              (parsedFilters.propertyType === 'house' && prop.title && (prop.title.toLowerCase().includes('house') || prop.title.toLowerCase().includes('duplex')));
            if (!typeMatch) return false;
          }
          
          return true;
        }
        
        return false;
      });
    }
    
    // Fallback to simple text search
    return properties.filter(prop => 
      (prop.title && prop.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prop.location && prop.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Add favorite status to properties
  const propertiesWithFavorites = (properties: any[]) => 
    filterProperties(properties).map(prop => ({
      ...prop,
      isFavorite: favorites.has(prop.id)
    }));

  return (
    <Layout activeTab="home">
      <div className="lg:pt-20">
        <PropertySearchHeader />
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading properties...</p>
            </div>
          </div>
        ) : (
          <>
            <FeaturedCarousel 
              properties={featuredProperties}
              onPropertyClick={handlePropertyClick}
            />
            
            {locationPermission === 'granted' && nearbyProperties.length > 0 && (
              <PropertySection
                title={`Recent listings around you`}
                properties={propertiesWithFavorites(nearbyProperties)}
                onPropertyClick={handlePropertyClick}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
            
            <PropertySection
              title="Recent Houses for Rent"
              properties={propertiesWithFavorites(recentRentListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Recent Shortlet Listings"
              properties={propertiesWithFavorites(recentShortletListings)}
              onPropertyClick={handleShortletClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Houses for Sale"
              properties={propertiesWithFavorites(recentSaleListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Land for Sale"
              properties={propertiesWithFavorites(landForSale)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </>
        )}
        
        {/* Bottom spacing for nav */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default Explore;