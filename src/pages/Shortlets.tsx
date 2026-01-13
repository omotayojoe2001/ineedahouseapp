import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyService } from '../services/propertyService';

const Shortlets: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [shortletProperties, setShortletProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch shortlet properties from database
  useEffect(() => {
    const fetchShortlets = async () => {
      try {
        const { data, error } = await supabase
          .from('shortlets')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedProperties = (data || []).map(shortlet => ({
          id: shortlet.id,
          title: shortlet.title,
          location: shortlet.location,
          price: shortlet.daily_rate,
          duration: 'day' as const,
          bedrooms: shortlet.bedrooms,
          bathrooms: shortlet.bathrooms,
          sqft: shortlet.area_sqm,
          imageUrl: shortlet.images?.[0] || '/placeholder.svg',
          rating: shortlet.rating || 4.5,
          verified: shortlet.verified || false,
        }));

        setShortletProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching shortlets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlets();
  }, []);

  const handlePropertyClick = (property: any) => {
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

  const filteredProperties = shortletProperties.filter(property =>
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Shortlets</h1>
          <p className="text-muted-foreground">Perfect for short stays and vacations</p>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-4 border-b border-border">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Calendar size={20} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Daily Rates</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Clock size={20} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Instant Booking</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <MapPin size={20} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Prime Locations</p>
            </div>
          </div>

          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search shortlets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Properties List */}
        <div className="px-2 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading shortlets...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-sm text-muted-foreground">{filteredProperties.length} shortlets available</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    isShortlet={true}
                    onClick={() => handlePropertyClick(property)}
                    onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default Shortlets;