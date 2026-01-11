import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { ArrowLeft, SlidersHorizontal, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import property images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const CategoryListing = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const categoryData = {
    // Original categories
    'popular-homes-in-lagos': {
      title: 'Popular Homes in Lagos',
      properties: [
        { id: '1', title: 'Room in Lekki', location: 'Lekki Phase 1, Lagos', price: 150000, duration: 'month', imageUrl: property1, rating: 4.96, verified: true, badge: 'Guest favorite' },
        { id: '2', title: 'Room in Victoria Island', location: 'Victoria Island, Lagos', price: 200000, duration: 'month', imageUrl: property2, rating: 4.92, verified: true, badge: 'Featured' },
        { id: '3', title: 'Apartment in Ikeja', location: 'Ikeja GRA, Lagos', price: 180000, duration: 'month', imageUrl: property3, rating: 4.88, verified: true },
        { id: '4', title: 'Studio in Yaba', location: 'Yaba, Lagos', price: 120000, duration: 'month', imageUrl: property4, rating: 4.85, verified: true, badge: 'New' },
        { id: '21', title: 'Duplex in Magodo', location: 'Magodo Phase 2, Lagos', price: 350000, duration: 'month', imageUrl: property1, rating: 4.93, verified: true },
        { id: '22', title: 'Flat in Surulere', location: 'Surulere, Lagos', price: 140000, duration: 'month', imageUrl: property2, rating: 4.81, verified: true },
      ]
    },
    // New category mappings
    'homes': {
      title: 'Homes',
      properties: [
        { id: '1', title: 'Room in Lekki', location: 'Lekki Phase 1, Lagos', price: 150000, duration: 'month', imageUrl: property1, rating: 4.96, verified: true, badge: 'Guest favorite' },
        { id: '2', title: 'Room in Victoria Island', location: 'Victoria Island, Lagos', price: 200000, duration: 'month', imageUrl: property2, rating: 4.92, verified: true, badge: 'Featured' },
        { id: '3', title: 'Apartment in Ikeja', location: 'Ikeja GRA, Lagos', price: 180000, duration: 'month', imageUrl: property3, rating: 4.88, verified: true },
        { id: '4', title: 'Studio in Yaba', location: 'Yaba, Lagos', price: 120000, duration: 'month', imageUrl: property4, rating: 4.85, verified: true, badge: 'New' },
        { id: '21', title: 'Duplex in Magodo', location: 'Magodo Phase 2, Lagos', price: 350000, duration: 'month', imageUrl: property1, rating: 4.93, verified: true },
        { id: '22', title: 'Flat in Surulere', location: 'Surulere, Lagos', price: 140000, duration: 'month', imageUrl: property2, rating: 4.81, verified: true },
      ]
    },
    'shortlets': {
      title: 'Shortlets',
      properties: [
        { id: '31', title: 'Luxury Shortlet in VI', location: 'Victoria Island, Lagos', price: 25000, duration: 'night', imageUrl: property1, rating: 4.9, verified: true, badge: 'Superhost' },
        { id: '32', title: 'Cozy Apartment Lekki', location: 'Lekki Phase 1, Lagos', price: 18000, duration: 'night', imageUrl: property2, rating: 4.8, verified: true },
        { id: '33', title: 'Modern Studio Ikoyi', location: 'Ikoyi, Lagos', price: 22000, duration: 'night', imageUrl: property3, rating: 4.7, verified: true },
        { id: '34', title: 'Serviced Apartment Abuja', location: 'Maitama, Abuja', price: 30000, duration: 'night', imageUrl: property4, rating: 4.95, verified: true, badge: 'Premium' },
      ]
    },
    'services': {
      title: 'Services',
      properties: [
        { id: '14', title: 'Full House Moving Service', location: 'Lagos & Abuja', price: 150000, duration: 'service', imageUrl: property1, rating: 4.9, verified: true, badge: 'Top Rated' },
        { id: '15', title: 'Car Delivery Nigeria-wide', location: 'Nationwide Service', price: 75000, duration: 'delivery', imageUrl: property2, rating: 4.7, verified: true },
        { id: '16', title: 'Professional Painting', location: 'Lagos Metro', price: 25000, duration: 'room', imageUrl: property3, rating: 4.8, verified: true, badge: 'Verified' },
        { id: '17', title: 'Furniture Assembly', location: 'Lagos & Abuja', price: 15000, duration: 'item', imageUrl: property4, rating: 4.5, verified: true },
        { id: '29', title: 'Deep Cleaning Service', location: 'Major Cities', price: 35000, duration: 'service', imageUrl: property1, rating: 4.7, verified: true },
        { id: '30', title: 'Home Security Installation', location: 'Lagos Metro', price: 85000, duration: 'installation', imageUrl: property2, rating: 4.9, verified: true, badge: 'Professional' },
      ]
    },
    'rent': {
      title: 'Properties for Rent',
      properties: [
        { id: '5', title: 'Villa in Maitama', location: 'Maitama District, Abuja', price: 350000, duration: 'month', imageUrl: property3, rating: 4.94, verified: true, badge: 'Superhost' },
        { id: '6', title: 'Apartment in Garki', location: 'Garki Area 11, Abuja', price: 180000, duration: 'month', imageUrl: property4, rating: 4.87, verified: true },
        { id: '7', title: 'House in Wuse', location: 'Wuse 2, Abuja', price: 250000, duration: 'month', imageUrl: property1, rating: 4.91, verified: true, badge: 'Featured' },
        { id: '8', title: 'Duplex in Asokoro', location: 'Asokoro District, Abuja', price: 450000, duration: 'month', imageUrl: property2, rating: 4.98, verified: true, badge: 'Luxury' },
      ]
    },
    'buy': {
      title: 'Properties for Sale',
      properties: [
        { id: '12', title: '4BR Detached House', location: 'Lekki Phase 1, Lagos', price: 45000000, duration: 'total', imageUrl: property3, rating: 4.8, verified: true, badge: 'Move-in Ready' },
        { id: '13', title: 'Modern Duplex', location: 'Magodo, Lagos', price: 32000000, duration: 'total', imageUrl: property4, rating: 4.6, verified: true },
        { id: '23', title: '5BR Mansion', location: 'Banana Island, Lagos', price: 120000000, duration: 'total', imageUrl: property1, rating: 4.9, verified: true, badge: 'Luxury' },
        { id: '24', title: '3BR Bungalow', location: 'Ajah, Lagos', price: 28000000, duration: 'total', imageUrl: property2, rating: 4.5, verified: true },
      ]
    },
    'land': {
      title: 'Land for Sale',
      properties: [
        { id: '10', title: 'Prime Commercial Land', location: 'Victoria Island, Lagos', price: 25000000, duration: 'total', imageUrl: property1, rating: 4.5, verified: true, badge: 'Hot Deal' },
        { id: '11', title: 'Residential Plot', location: 'Ibeju-Lekki, Lagos', price: 8500000, duration: 'total', imageUrl: property2, rating: 4.3, verified: true },
        { id: '25', title: 'Industrial Land', location: 'Agbara, Ogun State', price: 15000000, duration: 'total', imageUrl: property3, rating: 4.2, verified: true },
        { id: '26', title: 'Waterfront Plot', location: 'Lekki Peninsula, Lagos', price: 35000000, duration: 'total', imageUrl: property4, rating: 4.7, verified: true, badge: 'Premium' },
      ]
    },
    // Keep original categories for backward compatibility
    'available-next-month-in-abuja': {
      title: 'Available Next Month in Abuja',
      properties: [
        { id: '5', title: 'Villa in Maitama', location: 'Maitama District, Abuja', price: 350000, duration: 'month', imageUrl: property3, rating: 4.94, verified: true, badge: 'Superhost' },
        { id: '6', title: 'Apartment in Garki', location: 'Garki Area 11, Abuja', price: 180000, duration: 'month', imageUrl: property4, rating: 4.87, verified: true },
        { id: '7', title: 'House in Wuse', location: 'Wuse 2, Abuja', price: 250000, duration: 'month', imageUrl: property1, rating: 4.91, verified: true, badge: 'Featured' },
        { id: '8', title: 'Duplex in Asokoro', location: 'Asokoro District, Abuja', price: 450000, duration: 'month', imageUrl: property2, rating: 4.98, verified: true, badge: 'Luxury' },
      ]
    },
    'houses-for-sale': {
      title: 'Houses for Sale',
      properties: [
        { id: '12', title: '4BR Detached House', location: 'Lekki Phase 1, Lagos', price: 45000000, duration: 'total', imageUrl: property3, rating: 4.8, verified: true, badge: 'Move-in Ready' },
        { id: '13', title: 'Modern Duplex', location: 'Magodo, Lagos', price: 32000000, duration: 'total', imageUrl: property4, rating: 4.6, verified: true },
        { id: '23', title: '5BR Mansion', location: 'Banana Island, Lagos', price: 120000000, duration: 'total', imageUrl: property1, rating: 4.9, verified: true, badge: 'Luxury' },
        { id: '24', title: '3BR Bungalow', location: 'Ajah, Lagos', price: 28000000, duration: 'total', imageUrl: property2, rating: 4.5, verified: true },
      ]
    },
    'land-for-sale': {
      title: 'Land for Sale',
      properties: [
        { id: '10', title: 'Prime Commercial Land', location: 'Victoria Island, Lagos', price: 25000000, duration: 'total', imageUrl: property1, rating: 4.5, verified: true, badge: 'Hot Deal' },
        { id: '11', title: 'Residential Plot', location: 'Ibeju-Lekki, Lagos', price: 8500000, duration: 'total', imageUrl: property2, rating: 4.3, verified: true },
        { id: '25', title: 'Industrial Land', location: 'Agbara, Ogun State', price: 15000000, duration: 'total', imageUrl: property3, rating: 4.2, verified: true },
        { id: '26', title: 'Waterfront Plot', location: 'Lekki Peninsula, Lagos', price: 35000000, duration: 'total', imageUrl: property4, rating: 4.7, verified: true, badge: 'Premium' },
      ]
    },
    'property-relocation-services': {
      title: 'Property Relocation Services',
      properties: [
        { id: '14', title: 'Full House Moving Service', location: 'Lagos & Abuja', price: 150000, duration: 'service', imageUrl: property1, rating: 4.9, verified: true, badge: 'Top Rated' },
        { id: '15', title: 'Car Delivery Nigeria-wide', location: 'Nationwide Service', price: 75000, duration: 'delivery', imageUrl: property2, rating: 4.7, verified: true },
        { id: '27', title: 'Office Relocation', location: 'Lagos Metro', price: 200000, duration: 'service', imageUrl: property3, rating: 4.8, verified: true },
        { id: '28', title: 'International Shipping', location: 'Global Service', price: 500000, duration: 'shipment', imageUrl: property4, rating: 4.6, verified: true },
      ]
    },
    'other-services': {
      title: 'Other Services',
      properties: [
        { id: '16', title: 'Professional Painting', location: 'Lagos Metro', price: 25000, duration: 'room', imageUrl: property3, rating: 4.8, verified: true, badge: 'Verified' },
        { id: '17', title: 'Furniture Assembly', location: 'Lagos & Abuja', price: 15000, duration: 'item', imageUrl: property4, rating: 4.5, verified: true },
        { id: '29', title: 'Deep Cleaning Service', location: 'Major Cities', price: 35000, duration: 'service', imageUrl: property1, rating: 4.7, verified: true },
        { id: '30', title: 'Home Security Installation', location: 'Lagos Metro', price: 85000, duration: 'installation', imageUrl: property2, rating: 4.9, verified: true, badge: 'Professional' },
      ]
    }
  };

  const currentCategory = categoryData[category] || { title: 'Properties', properties: [] };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.id}`);
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

  const filteredProperties = currentCategory.properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(property => ({
    ...property,
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
              <h1 className="text-xl font-bold text-foreground">{currentCategory.title}</h1>
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

export default CategoryListing;