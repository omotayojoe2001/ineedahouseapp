import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchHeader from '../components/SearchHeader';
import FeaturedCarousel from '../components/FeaturedCarousel';
import PropertyCard from '../components/PropertyCard';
import { Map, Grid, List } from 'lucide-react';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredProperties = [
    {
      id: '1',
      title: 'Luxury Waterfront Apartment',
      location: 'Victoria Island, Lagos',
      price: 850000,
      duration: 'month' as const,
      imageUrl: property3,
      rating: 4.8,
      isSponsored: true,
      sponsorName: 'Glenmore',
    },
    {
      id: '2',
      title: 'Modern Villa with Pool',
      location: 'Lekki Phase 1, Lagos',
      price: 15000000,
      duration: 'sale' as const,
      imageUrl: property2,
      rating: 4.9,
      isSponsored: true,
      sponsorName: 'Rotrow',
    },
    {
      id: '3',
      title: 'Executive Townhouse',
      location: 'Maitama, Abuja',
      price: 1200000,
      duration: 'month' as const,
      imageUrl: property4,
      rating: 4.7,
    },
  ];

  const recentProperties = [
    {
      id: '4',
      title: 'Serviced Apartment',
      location: 'Ikeja GRA, Lagos',
      price: 25000,
      duration: 'day' as const,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      imageUrl: property1,
      rating: 4.6,
      verified: true,
    },
    {
      id: '5',
      title: 'Family Duplex',
      location: 'Magodo, Lagos',
      price: 600000,
      duration: 'month' as const,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2500,
      imageUrl: property2,
      rating: 4.5,
      verified: true,
    },
    {
      id: '6',
      title: 'Studio Apartment',
      location: 'Yaba, Lagos',
      price: 180000,
      duration: 'month' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      imageUrl: property3,
      rating: 4.3,
    },
    {
      id: '7',
      title: 'Luxury Penthouse',
      location: 'Banana Island, Lagos',
      price: 2500000,
      duration: 'month' as const,
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4200,
      imageUrl: property4,
      rating: 4.9,
      isFeatured: true,
      verified: true,
    },
  ];

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Layout activeTab="home">
      {/* Search Header */}
      <SearchHeader />
      
      {/* Featured Properties Carousel */}
      <FeaturedCarousel 
        properties={featuredProperties}
        onPropertyClick={handlePropertyClick}
      />
      
      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="bg-surface-light rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <button className="flex-1 bg-card border border-card-border rounded-lg p-3 text-center">
              <Map className="mx-auto mb-2 text-primary" size={24} />
              <span className="text-sm font-medium text-foreground">Map View</span>
            </button>
            <button className="flex-1 bg-card border border-card-border rounded-lg p-3 text-center">
              <Grid className="mx-auto mb-2 text-primary" size={24} />
              <span className="text-sm font-medium text-foreground">Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Properties */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Properties</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1'}`}>
          {recentProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom Spacing for Navigation */}
      <div className="h-6"></div>
    </Layout>
  );
};

export default Home;