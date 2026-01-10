import React, { useState } from 'react';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import CreateListingModal from '../components/CreateListingModal';
import { ArrowLeft, Plus, Filter, Grid, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MyListings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listings] = useState([
    {
      id: '1',
      title: 'My 3BR Apartment',
      location: 'Lekki, Lagos',
      price: 2500000,
      duration: 'year' as const,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      rating: 4.8,
      imageUrl: '/placeholder.svg',
      verified: true,
    },
    {
      id: '2',
      title: 'My Studio Flat',
      location: 'Ikeja, Lagos',
      price: 800000,
      duration: 'year' as const,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      rating: 4.5,
      imageUrl: '/placeholder.svg',
    },
  ]);

  const handleCreateListing = () => {
    if (user) {
      setShowCreateModal(true);
    } else {
      navigate('/auth', { state: { from: location } });
    }
  };

  const handleAuthRequired = () => {
    setShowCreateModal(false);
    navigate('/auth', { state: { from: location } });
  };

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">My Listings</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border hover:bg-muted">
                <Filter size={20} />
              </button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{listings.length} active listings</p>
        </div>

        {/* Add New Listing Button */}
        <div className="px-4 py-4">
          <button 
            onClick={handleCreateListing}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary rounded-lg text-primary hover:bg-primary/5"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Listing</span>
          </button>
        </div>

        {/* Listings */}
        <div className="px-2 py-4">
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1' : 'space-y-1'}>
            {listings.map((listing) => (
              <PropertyCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>

        <CreateListingModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onAuthRequired={handleAuthRequired}
        />
      </div>
    </Layout>
  );
};

export default MyListings;