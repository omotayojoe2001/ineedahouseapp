import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import CreateListingModal from '../components/CreateListingModal';
import { ArrowLeft, Plus, Filter, Grid, List, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MyListings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, location, price, category, bedrooms, bathrooms, rating, images, verified, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedListings = (data || []).map(prop => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.price,
          duration: prop.category === 'rent' ? 'year' : 'total',
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          rating: prop.rating || 4.5,
          imageUrl: prop.images?.[0],
          verified: prop.verified || false,
          category: prop.category,
        }));

        setListings(transformedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user]);

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

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast({ title: 'Success', description: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({ title: 'Error', description: 'Failed to delete listing', variant: 'destructive' });
    }
  };

  const handleEditListing = (listingId: string) => {
    navigate(`/create-rent-listing?edit=${listingId}`);
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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading your listings...</p>
              </div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No listings yet</p>
              <p className="text-sm text-muted-foreground">Create your first listing to get started</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1' : 'space-y-1'}>
              {listings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <PropertyCard {...listing} />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setShowMenu(showMenu === listing.id ? null : listing.id)}
                      className="p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                    {showMenu === listing.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                        <button
                          onClick={() => {
                            handleEditListing(listing.id);
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
                        >
                          <Edit size={14} className="text-green-500" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteListing(listing.id);
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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