import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, Truck, Wrench, Paintbrush, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import service images
import property1 from '../assets/property-1.jpg';
import property2 from '../assets/property-2.jpg';
import property3 from '../assets/property-3.jpg';
import property4 from '../assets/property-4.jpg';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const serviceCategories = [
    { id: 'all', label: 'All Services', icon: Users },
    { id: 'moving', label: 'Moving', icon: Truck },
    { id: 'repair', label: 'Repairs', icon: Wrench },
    { id: 'painting', label: 'Painting', icon: Paintbrush },
  ];

  const services = [
    {
      id: '1',
      title: 'Full House Moving Service',
      location: 'Lagos & Abuja',
      price: 150000,
      duration: 'service' as const,
      category: 'moving',
      imageUrl: property1,
      rating: 4.9,
      verified: true,
      badge: 'Top Rated',
    },
    {
      id: '2',
      title: 'Professional Painting',
      location: 'Available Nationwide',
      price: 25000,
      duration: 'room' as const,
      category: 'painting',
      imageUrl: property2,
      rating: 4.8,
      verified: true,
    },
    {
      id: '3',
      title: 'Plumbing & Electrical Repairs',
      location: 'Lagos Metro',
      price: 15000,
      duration: 'service' as const,
      category: 'repair',
      imageUrl: property3,
      rating: 4.7,
      verified: true,
      badge: 'Quick Response',
    },
    {
      id: '4',
      title: 'Furniture Assembly',
      location: 'Lagos, Abuja',
      price: 12000,
      duration: 'item' as const,
      category: 'repair',
      imageUrl: property4,
      rating: 4.6,
    },
    {
      id: '5',
      title: 'Car Delivery Service',
      location: 'Nigeria-wide',
      price: 75000,
      duration: 'delivery' as const,
      category: 'moving',
      imageUrl: property1,
      rating: 4.8,
      verified: true,
    },
    {
      id: '6',
      title: 'Deep Cleaning Service',
      location: 'Major Cities',
      price: 35000,
      duration: 'service' as const,
      category: 'repair',
      imageUrl: property2,
      rating: 4.5,
      verified: true,
      badge: 'Eco-Friendly',
    },
  ];

  const handlePropertyClick = (service: any) => {
    navigate(`/property/${service.id}`);
  };

  const handleFavoriteToggle = (serviceId: string) => {
    const newFavorites = new Set(favorites);
    const isAdding = !favorites.has(serviceId);
    
    if (isAdding) {
      newFavorites.add(serviceId);
      toast({
        title: "Service Saved!",
        description: "Added to your saved services",
      });
    } else {
      newFavorites.delete(serviceId);
      toast({
        title: "Service Removed",
        description: "Removed from your saved services",
      });
    }
    setFavorites(newFavorites);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).map(service => ({
    ...service,
    isFavorite: favorites.has(service.id)
  }));

  return (
    <Layout activeTab="home">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <h1 className="text-2xl font-bold text-foreground mb-2">Property Services</h1>
          <p className="text-muted-foreground">Professional services for your property needs</p>
        </div>

        {/* Categories */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="px-2 py-4">
          {/* Become Inspector Banner */}
          <div className="mx-2 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">Offer Property Inspection Services</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Join our network of trusted property inspectors
                  </p>
                </div>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => navigate('/inspector-registration')}
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm text-muted-foreground">{filteredServices.length} services available</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {filteredServices.map((service) => (
              <PropertyCard
                key={service.id}
                {...service}
                onClick={() => handlePropertyClick(service)}
                onFavoriteToggle={() => handleFavoriteToggle(service.id)}
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

export default Services;