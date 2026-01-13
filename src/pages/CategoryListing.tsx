import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { ArrowLeft, SlidersHorizontal, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CategoryListing = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const allProperties = [];

        // Fetch based on category
        if (category?.includes('home') || category?.includes('rent')) {
          // Fetch rental properties
          const [propertiesRes] = await Promise.allSettled([
            supabase.from('properties').select('*').eq('status', 'active').eq('category', 'rent').order('created_at', { ascending: false })
          ]);
          if (propertiesRes.status === 'fulfilled' && propertiesRes.value.data) {
            allProperties.push(...propertiesRes.value.data.map(p => ({ ...p, price: p.price, duration: 'month' })));
          }
        }

        if (category?.includes('shortlet')) {
          // Fetch shortlets
          const [shortletsRes] = await Promise.allSettled([
            supabase.from('shortlets').select('*').eq('status', 'active').order('created_at', { ascending: false })
          ]);
          if (shortletsRes.status === 'fulfilled' && shortletsRes.value.data) {
            allProperties.push(...shortletsRes.value.data.map(s => ({ ...s, price: s.daily_rate, duration: 'night' })));
          }
        }

        if (category?.includes('sale') || category?.includes('house')) {
          // Fetch sale properties (houses)
          const [saleRes] = await Promise.allSettled([
            supabase.from('sale_properties').select('*').eq('status', 'active').in('property_type', ['house', 'apartment', 'duplex', 'villa']).order('created_at', { ascending: false })
          ]);
          if (saleRes.status === 'fulfilled' && saleRes.value.data) {
            allProperties.push(...saleRes.value.data.map(p => ({ ...p, price: p.sale_price, duration: 'total' })));
          }
        }

        if (category?.includes('commercial')) {
          // Fetch commercial properties
          const [commercialRes] = await Promise.allSettled([
            supabase.from('sale_properties').select('*').eq('status', 'active').eq('property_type', 'commercial').order('created_at', { ascending: false })
          ]);
          if (commercialRes.status === 'fulfilled' && commercialRes.value.data) {
            allProperties.push(...commercialRes.value.data.map(p => ({ ...p, price: p.sale_price, duration: 'total' })));
          }
        }

        if (category?.includes('land')) {
          // Fetch land properties
          const [landRes] = await Promise.allSettled([
            supabase.from('sale_properties').select('*').eq('status', 'active').eq('property_type', 'land').order('created_at', { ascending: false })
          ]);
          if (landRes.status === 'fulfilled' && landRes.value.data) {
            allProperties.push(...landRes.value.data.map(p => ({ ...p, price: p.sale_price, duration: 'total' })));
          }
        }

        if (category?.includes('service')) {
          // Fetch services
          const [servicesRes] = await Promise.allSettled([
            supabase.from('services').select('*').eq('status', 'active').order('created_at', { ascending: false })
          ]);
          if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
            allProperties.push(...servicesRes.value.data.map(s => ({ ...s, price: s.pricing, duration: 'service' })));
          }
        }

        if (category?.includes('shop')) {
          // Fetch shops
          const [shopsRes] = await Promise.allSettled([
            supabase.from('shops').select('*').eq('status', 'active').order('created_at', { ascending: false })
          ]);
          if (shopsRes.status === 'fulfilled' && shopsRes.value.data) {
            allProperties.push(...shopsRes.value.data.map(s => ({ ...s, price: s.monthly_rent, duration: 'month' })));
          }
        }

        if (category?.includes('event')) {
          // Fetch event centers
          const [eventsRes] = await Promise.allSettled([
            supabase.from('event_centers').select('*').eq('status', 'active').order('created_at', { ascending: false })
          ]);
          if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
            allProperties.push(...eventsRes.value.data.map(e => ({ ...e, price: e.daily_rate, duration: 'day' })));
          }
        }

        setProperties(allProperties);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  const getCategoryTitle = () => {
    if (category?.includes('home')) return 'Recent Home Listings';
    if (category?.includes('shortlet')) return 'Recent Shortlet Listings';
    if (category?.includes('house')) return 'Recent Houses for Sale';
    if (category?.includes('commercial')) return 'Recent Commercial Properties';
    if (category?.includes('land')) return 'Recent Land Listings';
    if (category?.includes('service')) return 'Services';
    if (category?.includes('shop')) return 'Shop Listings';
    if (category?.includes('event')) return 'Event Center Listings';
    return 'Properties';
  };

  const handlePropertyClick = (property) => {
    // Route shortlets to shortlet details page
    if (property.duration === 'night' || property.duration === 'day' || category === 'shortlets') {
      navigate(`/shortlet/${property.id}`);
    } else {
      navigate(`/property/${property.id}`);
    }
  };

  const handleFavoriteToggle = (propertyId) => {
    const newFavorites = new Set(favorites);
    const isAdding = !favorites.has(propertyId);
    
    if (isAdding) {
      newFavorites.add(propertyId);
      toast({
        title: "Property Saved!",
        description: "Added to your saved properties",
      });
    } else {
      newFavorites.delete(propertyId);
      toast({
        title: "Property Removed",
        description: "Removed from your saved properties",
      });
    }
    setFavorites(newFavorites);
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(property => ({
    ...property,
    id: property.id,
    title: property.title,
    location: property.location,
    price: Number(property.price) || 0,
    duration: property.duration,
    rating: property.rating || 4.5,
    imageUrl: property.images?.[0] || '/placeholder.svg',
    verified: property.verified || false,
    isFavorite: favorites.has(property.id)
  }));

  return (
    <Layout activeTab="home">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/80 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{getCategoryTitle()}</h1>
              <p className="text-sm text-muted-foreground">{filteredProperties.length} properties available</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 py-4 border-b border-border">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="px-2 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading properties...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  isShortlet={property.duration === 'night' || property.duration === 'day' || category === 'shortlets'}
                  onClick={() => handlePropertyClick(property)}
                  onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default CategoryListing;