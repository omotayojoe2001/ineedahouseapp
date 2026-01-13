import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, TrendingUp, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Buy: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [propertiesForSale, setPropertiesForSale] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('sale_properties')
          .select('*')
          .eq('status', 'active')
          .in('property_type', ['house', 'commercial'])
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedProperties = (data || []).map(prop => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.sale_price,
          duration: 'sale' as const,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          sqft: prop.area_sqm,
          imageUrl: prop.images?.[0] || property1,
          rating: prop.rating || 4.5,
          verified: prop.verified || false,
          badge: prop.property_sub_type || 'For Sale',
        }));

        setPropertiesForSale(transformedProperties);
      } catch (error) {
        console.error('Error fetching sale properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProperties();
  }, []);

  const priceRanges = [
    { label: 'Under ₦20M', min: 0, max: 20000000 },
    { label: '₦20M - ₦50M', min: 20000000, max: 50000000 },
    { label: '₦50M - ₦100M', min: 50000000, max: 100000000 },
    { label: 'Above ₦100M', min: 100000000, max: Infinity },
  ];

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleFavoriteToggle = (propertyId: string) => {
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

  const filteredProperties = propertiesForSale.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(prop => ({
    ...prop,
    isFavorite: favorites.has(prop.id)
  }));

  return (
    <Layout activeTab="home">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <h1 className="text-2xl font-bold text-foreground mb-2">Properties for Sale</h1>
          <p className="text-muted-foreground">Find your dream home to buy</p>
        </div>

        {/* Market Insights */}
        <div className="px-4 py-4 border-b border-border">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Market Trend</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500">Property values up 8% this year</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Hot Areas</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-500">Lekki, Victoria Island</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap text-sm"
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search properties for sale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>{filteredProperties.length} properties for sale</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <List size={16} />
              </button>
            </div>
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
            <div className={`grid gap-1 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
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

export default Buy;