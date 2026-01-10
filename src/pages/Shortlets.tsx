import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Shortlets: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const shortletProperties = [
    {
      id: '1',
      title: 'Luxury Serviced Apartment',
      location: 'Victoria Island, Lagos',
      price: 35000,
      duration: 'day' as const,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      imageUrl: property1,
      rating: 4.9,
      verified: true,
      badge: 'Popular',
    },
    {
      id: '2',
      title: 'Executive Studio',
      location: 'Lekki Phase 1, Lagos',
      price: 25000,
      duration: 'day' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      imageUrl: property2,
      rating: 4.7,
      verified: true,
    },
    {
      id: '3',
      title: 'Premium 3BR Shortlet',
      location: 'Ikeja GRA, Lagos',
      price: 45000,
      duration: 'day' as const,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1600,
      imageUrl: property3,
      rating: 4.8,
      verified: true,
      badge: 'New',
    },
    {
      id: '4',
      title: 'Cozy 1BR Apartment',
      location: 'Yaba, Lagos',
      price: 18000,
      duration: 'day' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      imageUrl: property4,
      rating: 4.5,
    },
    {
      id: '5',
      title: 'Spacious 4BR Duplex',
      location: 'Maitama, Abuja',
      price: 65000,
      duration: 'day' as const,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2500,
      imageUrl: property1,
      rating: 4.9,
      verified: true,
      badge: 'Featured',
    },
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
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm text-muted-foreground">{filteredProperties.length} shortlets available</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onClick={() => handlePropertyClick(property)}
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default Shortlets;