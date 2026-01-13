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

  // Fetch properties and shortlets from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make all queries in parallel for better performance
        const [propertiesRes, salePropertiesRes, shortletsRes, servicesRes, shopsRes, eventCentersRes] = await Promise.allSettled([
          supabase.from('properties').select('*, property_images(image_url, is_primary)').eq('status', 'active').order('created_at', { ascending: false }),
          supabase.from('sale_properties').select('*').eq('status', 'active').order('created_at', { ascending: false }),
          supabase.from('shortlets').select('*').eq('status', 'active').order('created_at', { ascending: false }),
          supabase.from('services').select('*').eq('status', 'active').order('created_at', { ascending: false }),
          supabase.from('shops').select('*').eq('status', 'active').order('created_at', { ascending: false }),
          supabase.from('event_centers').select('*').eq('status', 'active').order('created_at', { ascending: false })
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
    console.log('Property images:', prop.images);
    console.log('Property property_images:', prop.property_images);
    console.log('Full property object:', prop);
    
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
    .slice(0, 4)
    .map(transformProperty);

  const nextMonthAbuja = loading ? [] : properties
    .filter(prop => prop.location?.toLowerCase().includes('abuja') && prop.category === 'rent')
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
    .filter(prop => prop.category === 'sale' && prop.property_type !== 'land' && prop.property_type !== 'commercial')
    .slice(0, 4)
    .map(transformProperty);

  const recentCommercialListings = loading ? [] : properties
    .filter(prop => prop.category === 'sale' && prop.property_type === 'commercial')
    .slice(0, 4)
    .map(transformProperty);

  const recentLandListings = loading ? [] : properties
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

  const recentShopListings = loading ? [] : properties
    .filter(prop => prop.category === 'shop')
    .slice(0, 4)
    .map(transformProperty);

  const recentEventCenterListings = loading ? [] : properties
    .filter(prop => prop.category === 'event_center')
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
      const isAdding = await PropertyService.toggleFavorite(propertyId);
      
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
            
            <PropertySection
              title="Recent Home Listings"
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
              title="Recent Houses for Sale"
              properties={propertiesWithFavorites(recentSaleListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Recent Commercial Properties"
              properties={propertiesWithFavorites(recentCommercialListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Recent Land Listings"
              properties={propertiesWithFavorites(recentLandListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Recent Shop Listings"
              properties={propertiesWithFavorites(recentShopListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Recent Event Center Listings"
              properties={propertiesWithFavorites(recentEventCenterListings)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Popular homes in Lagos"
              properties={propertiesWithFavorites(popularLagosProperties)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
            
            <PropertySection
              title="Available next month in Abuja"
              properties={propertiesWithFavorites(nextMonthAbuja)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />

            <PropertySection
              title="Houses for sale"
              properties={propertiesWithFavorites(propertiesForSale)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />

            <PropertySection
              title="Land for sale"
              properties={propertiesWithFavorites(landForSale)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />

            <PropertySection
              title="Property relocation services"
              properties={propertiesWithFavorites(relocationServices)}
              onPropertyClick={handlePropertyClick}
              onFavoriteToggle={handleFavoriteToggle}
            />

            <PropertySection
              title="Other services"
              properties={propertiesWithFavorites(otherServices)}
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