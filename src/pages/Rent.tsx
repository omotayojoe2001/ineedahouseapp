import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Filter, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Rent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('newest');

  const rentalProperties = [
    {
      id: '1',
      title: 'Modern 2BR Apartment',
      location: 'Lekki Phase 1, Lagos',
      price: 400000,
      duration: 'month' as const,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      imageUrl: property1,
      rating: 4.8,
      verified: true,
      badge: 'Available Now',
    },
    {
      id: '2',
      title: 'Executive 3BR Flat',
      location: 'Victoria Island, Lagos',
      price: 750000,
      duration: 'month' as const,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2000,
      imageUrl: property2,
      rating: 4.9,
      verified: true,
      badge: 'Furnished',
    },
    {
      id: '3',
      title: 'Cozy 1BR Studio',
      location: 'Yaba, Lagos',
      price: 180000,
      duration: 'month' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      imageUrl: property3,
      rating: 4.5,
    },
    {
      id: '4',
      title: 'Spacious 4BR Duplex',
      location: 'Ikeja GRA, Lagos',
      price: 950000,
      duration: 'month' as const,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      imageUrl: property4,
      rating: 4.7,
      verified: true,
      badge: 'Family Friendly',
    },
    {
      id: '5',
      title: 'Luxury Penthouse',
      location: 'Banana Island, Lagos',
      price: 2500000,
      duration: 'month' as const,
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4000,
      imageUrl: property1,
      rating: 4.9,
      verified: true,
      badge: 'Premium',
    },
    {
      id: '6',
      title: 'Shared Apartment',
      location: 'Surulere, Lagos',
      price: 120000,
      duration: 'month' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      imageUrl: property2,
      rating: 4.3,
      badge: 'Budget Friendly',
    },
  ];

  const priceRanges = [
    { label: 'Under ₦200k', min: 0, max: 200000 },
    { label: '₦200k - ₦500k', min: 200000, max: 500000 },
    { label: '₦500k - ₦1M', min: 500000, max: 1000000 },
    { label: 'Above ₦1M', min: 1000000, max: Infinity },
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

  const filteredProperties = rentalProperties.filter(property =>
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Properties for Rent</h1>
          <p className="text-muted-foreground">Find your next rental property</p>
        </div>

        {/* Quick Filters */}
        <div className="px-4 py-4 border-b border-border">
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
              placeholder="Search rental properties..."
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
              <span>{filteredProperties.length} properties for rent</span>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-2 py-1 bg-background"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
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
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default Rent;