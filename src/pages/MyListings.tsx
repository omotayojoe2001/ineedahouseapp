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
        // Make all queries in parallel for better performance
        const [propertiesRes, shortletsRes, salePropertiesRes, servicesRes, shopsRes, eventCentersRes] = await Promise.allSettled([
          supabase.from('properties').select('id, title, location, price, category, bedrooms, bathrooms, images, created_at').eq('user_id', user.id).limit(50),
          supabase.from('shortlets').select('id, title, location, daily_rate, bedrooms, bathrooms, images, created_at').eq('user_id', user.id).limit(50),
          supabase.from('sale_properties').select('id, title, location, sale_price, property_type, bedrooms, bathrooms, images, created_at').eq('user_id', user.id).limit(50),
          supabase.from('services').select('id, title, location, pricing, service_type, images, created_at').eq('user_id', user.id).limit(50),
          supabase.from('shops').select('id, title, location, monthly_rent, shop_type, images, created_at').eq('user_id', user.id).limit(50),
          supabase.from('event_centers').select('id, title, location, daily_rate, venue_type, guest_capacity, images, created_at').eq('user_id', user.id).limit(50)
        ]);

        const allListings: any[] = [];

        // Process properties
        if (propertiesRes.status === 'fulfilled' && propertiesRes.value.data) {
          const transformed = propertiesRes.value.data.map(prop => ({
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
            created_at: prop.created_at,
          }));
          allListings.push(...transformed);
        }

        // Process shortlets
        if (shortletsRes.status === 'fulfilled' && shortletsRes.value.data) {
          const transformed = shortletsRes.value.data.map(shortlet => ({
            id: shortlet.id,
            title: shortlet.title,
            location: shortlet.location,
            price: shortlet.daily_rate,
            duration: 'day',
            bedrooms: shortlet.bedrooms,
            bathrooms: shortlet.bathrooms,
            rating: shortlet.rating || 4.5,
            imageUrl: shortlet.images?.[0],
            verified: shortlet.verified || false,
            category: 'shortlet',
            created_at: shortlet.created_at,
          }));
          allListings.push(...transformed);
        }

        // Process sale properties
        if (salePropertiesRes.status === 'fulfilled' && salePropertiesRes.value.data) {
          const transformed = salePropertiesRes.value.data.map(prop => ({
            id: prop.id,
            title: prop.title,
            location: prop.location,
            price: prop.sale_price,
            duration: 'total',
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            rating: prop.rating || 4.5,
            imageUrl: prop.images?.[0],
            verified: prop.verified || false,
            category: 'sale',
            badge: prop.property_type,
            created_at: prop.created_at,
          }));
          allListings.push(...transformed);
        }

        // Process services
        if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
          console.log('Services data:', servicesRes.value.data);
          const transformed = servicesRes.value.data.map(service => {
            const priceNum = typeof service.pricing === 'string' ? parseFloat(service.pricing.replace(/[^0-9.]/g, '')) : service.pricing;
            console.log('Service transform:', { title: service.title, pricing: service.pricing, priceNum });
            return {
              id: service.id,
              title: service.title,
              location: service.location,
              price: priceNum || 0,
              duration: 'service',
              rating: 4.5,
              imageUrl: service.images?.[0] || '/placeholder.svg',
              verified: false,
              category: 'service',
              badge: service.service_type,
              created_at: service.created_at,
            };
          });
          console.log('Transformed services:', transformed);
          allListings.push(...transformed);
        }

        // Process shops
        if (shopsRes.status === 'fulfilled' && shopsRes.value.data) {
          const transformed = shopsRes.value.data.map(shop => ({
            id: shop.id,
            title: shop.title,
            location: shop.location,
            price: shop.monthly_rent,
            duration: 'month',
            rating: shop.rating || 4.5,
            imageUrl: shop.images?.[0],
            verified: shop.verified || false,
            category: 'shop',
            badge: shop.shop_type,
            created_at: shop.created_at,
          }));
          allListings.push(...transformed);
        }

        // Process event centers
        if (eventCentersRes.status === 'fulfilled' && eventCentersRes.value.data) {
          const transformed = eventCentersRes.value.data.map(event => ({
            id: event.id,
            title: event.title,
            location: event.location,
            price: event.daily_rate,
            duration: 'day',
            sqft: event.guest_capacity,
            rating: event.rating || 4.5,
            imageUrl: event.images?.[0],
            verified: event.verified || false,
            category: 'event_center',
            badge: event.venue_type,
            created_at: event.created_at,
          }));
          allListings.push(...transformed);
        }

        // Sort all listings by creation date
        const sortedListings = allListings.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );

        setListings(sortedListings);
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
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        console.error('Listing not found:', listingId);
        return;
      }

      let tableName = 'properties';
      switch (listing.category) {
        case 'shortlet':
          tableName = 'shortlets';
          break;
        case 'sale':
          tableName = 'sale_properties';
          break;
        case 'service':
          tableName = 'services';
          break;
        case 'shop':
          tableName = 'shops';
          break;
        case 'event_center':
          tableName = 'event_centers';
          break;
        default:
          tableName = 'properties';
      }

      console.log('Deleting from table:', tableName, 'ID:', listingId, 'Category:', listing.category);
      console.log('Current user ID:', user?.id);

      // First, check if the record exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from(tableName)
        .select('id, user_id')
        .eq('id', listingId)
        .single();

      console.log('Existing record check:', { existingRecord, fetchError });

      if (fetchError) {
        console.error('Record not found or error fetching:', fetchError);
        toast({ title: 'Error', description: 'Record not found', variant: 'destructive' });
        return;
      }

      if (existingRecord.user_id !== user?.id) {
        console.error('User ID mismatch. Record user_id:', existingRecord.user_id, 'Current user:', user?.id);
        toast({ title: 'Error', description: 'Not authorized to delete this listing', variant: 'destructive' });
        return;
      }

      // Now try to delete
      const { error, data } = await supabase
        .from(tableName)
        .delete()
        .eq('id', listingId)
        .select();

      console.log('Delete result:', { error, data });

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast({ title: 'Success', description: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({ title: 'Error', description: 'Failed to delete listing', variant: 'destructive' });
    }
  };

  const handleEditListing = (listing: any) => {
    // Route to appropriate edit page based on category
    switch (listing.category) {
      case 'rent':
        navigate(`/create-rent-listing-new?edit=${listing.id}`);
        break;
      case 'sale':
        navigate(`/create-sale-listing?edit=${listing.id}`);
        break;
      case 'shortlet':
        navigate(`/create-shortlet-listing?edit=${listing.id}`);
        break;
      case 'event_center':
        navigate(`/create-event-center-listing?edit=${listing.id}`);
        break;
      case 'shop':
        navigate(`/create-shop-listing?edit=${listing.id}`);
        break;
      default:
        navigate(`/create-rent-listing?edit=${listing.id}`);
    }
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
                  <PropertyCard 
                    {...listing} 
                    isShortlet={listing.category === 'shortlet' || listing.duration === 'day'}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setShowMenu(showMenu === listing.id ? null : listing.id)}
                      className="p-2 bg-white rounded-full shadow-md opacity-100 transition-opacity hover:opacity-80"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                    {showMenu === listing.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                        <button
                          onClick={() => {
                            handleEditListing(listing);
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