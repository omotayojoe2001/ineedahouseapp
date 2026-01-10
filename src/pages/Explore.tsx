import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchHeader from '../components/SearchHeader';
import PropertySection from '../components/PropertySection';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useToast } from '@/hooks/use-toast';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const popularLagosProperties = [
    {
      id: '1',
      title: 'Room in Lekki',
      price: 150000,
      duration: '/ month',
      rating: 4.96,
      imageUrl: property1,
      badge: 'Guest favorite',
    },
    {
      id: '2', 
      title: 'Room in Victoria Island',
      price: 200000,
      duration: '/ month',
      rating: 4.92,
      imageUrl: property2,
      badge: 'Featured',
    },
    {
      id: '3',
      title: 'Apartment in Ikeja',
      price: 180000,
      duration: '/ month', 
      rating: 4.88,
      imageUrl: property3,
    },
    {
      id: '4',
      title: 'Studio in Yaba',
      price: 120000,
      duration: '/ month',
      rating: 4.85,
      imageUrl: property4,
      badge: 'New',
    },
  ];

  const nextMonthAbuja = [
    {
      id: '5',
      title: 'Villa in Maitama',
      price: 350000,
      duration: '/ month',
      rating: 4.94,
      imageUrl: property3,
      badge: 'Superhost',
    },
    {
      id: '6',
      title: 'Apartment in Garki',
      price: 180000, 
      duration: '/ month',
      rating: 4.87,
      imageUrl: property4,
    },
    {
      id: '7',
      title: 'House in Wuse',
      price: 250000,
      duration: '/ month',
      rating: 4.91,
      imageUrl: property1,
      badge: 'Featured',
    },
    {
      id: '8',
      title: 'Duplex in Asokoro',
      price: 450000,
      duration: '/ month', 
      rating: 4.98,
      imageUrl: property2,
      badge: 'Luxury',
    },
  ];

  const landForSale = [
    {
      id: '10',
      title: 'Prime Commercial Land',
      price: 25000000,
      duration: ' total',
      rating: 4.5,
      imageUrl: property1,
      badge: 'Hot Deal',
    },
    {
      id: '11',
      title: 'Residential Plot',
      price: 8500000,
      duration: ' total',
      rating: 4.3,
      imageUrl: property2,
    },
  ];

  const propertiesForSale = [
    {
      id: '12',
      title: '4BR Detached House',
      price: 45000000,
      duration: ' total',
      rating: 4.8,
      imageUrl: property3,
      badge: 'Move-in Ready',
    },
    {
      id: '13',
      title: 'Modern Duplex',
      price: 32000000,
      duration: ' total',
      rating: 4.6,
      imageUrl: property4,
    },
  ];

  const relocationServices = [
    {
      id: '14',
      title: 'Full House Moving Service',
      price: 150000,
      duration: ' per service',
      rating: 4.9,
      imageUrl: property1,
      badge: 'Top Rated',
    },
    {
      id: '15',
      title: 'Car Delivery Nigeria-wide',
      price: 75000,
      duration: ' per delivery',
      rating: 4.7,
      imageUrl: property2,
    },
  ];

  const otherServices = [
    {
      id: '16',
      title: 'Professional Painting',
      price: 25000,
      duration: ' per room',
      rating: 4.8,
      imageUrl: property3,
      badge: 'Verified',
    },
    {
      id: '17',
      title: 'Furniture Assembly',
      price: 15000,
      duration: ' per item',
      rating: 4.5,
      imageUrl: property4,
    },
  ];

  const featuredProperties = [
    {
      id: '18',
      title: 'Luxury Penthouse Suite',
      location: 'Victoria Island, Lagos',
      price: 1500000,
      duration: 'month' as const,
      imageUrl: property1,
      rating: 4.9,
      isSponsored: true,
      sponsorName: 'Premium Homes',
    },
    {
      id: '19',
      title: 'Modern Smart Home',
      location: 'Lekki Phase 1, Lagos',
      price: 850000,
      duration: 'month' as const,
      imageUrl: property2,
      rating: 4.8,
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

  // Add favorite status to properties
  const propertiesWithFavorites = (properties: any[]) => 
    properties.map(prop => ({
      ...prop,
      isFavorite: favorites.has(prop.id)
    }));

  return (
    <Layout activeTab="home">
      <div className="lg:pt-20">
        <SearchHeader showFilters={true} />
        
        <FeaturedCarousel 
          properties={featuredProperties}
          onPropertyClick={handlePropertyClick}
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
        
        {/* Bottom spacing for nav */}
        <div className="h-6"></div>
      </div>
    </Layout>
  );
};

export default Explore;