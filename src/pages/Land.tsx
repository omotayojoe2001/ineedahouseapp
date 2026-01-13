import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Calculator, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import land images
import property1 from '../assets/land-plot.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Land: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [landProperties, setLandProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('sale_properties')
          .select('*')
          .eq('status', 'active')
          .eq('property_type', 'land')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedProperties = (data || []).map(prop => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.sale_price,
          duration: 'total' as const,
          sqft: prop.area_sqm,
          imageUrl: prop.images?.[0] || property1,
          rating: prop.rating || 4.5,
          verified: prop.verified || false,
          badge: prop.property_sub_type || 'Land',
        }));

        setLandProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching land properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandProperties();
  }, []);

  const landTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'agricultural', label: 'Agricultural' },
    { id: 'mixed', label: 'Mixed-Use' },
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
        title: "Land Saved!",
        description: "Added to your saved properties",
      });
    } else {
      newFavorites.delete(propertyId);
      toast({
        title: "Land Removed",
        description: "Removed from your saved properties",
      });
    }
    setFavorites(newFavorites);
  };

  const filteredProperties = landProperties.filter(property =>
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Land for Sale</h1>
          <p className="text-muted-foreground">Invest in prime real estate land</p>
        </div>

        {/* Land Calculator */}
        <div className="px-4 py-4 border-b border-border">
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Land Investment Calculator</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Calculate potential returns on your land investment
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Use Calculator
            </button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {landTypes.map((type) => (
              <button
                key={type.id}
                className="px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap text-sm"
              >
                {type.label}
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
              placeholder="Search land for sale..."
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
              <span>{filteredProperties.length} land plots available</span>
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

        {/* Land Grid */}
        <div className="px-2 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading land properties...</p>
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

export default Land;