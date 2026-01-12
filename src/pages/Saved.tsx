import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Heart, Filter, Grid, List, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { PropertyService } from '../services/propertyService';

const Saved = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      const favorites = await PropertyService.getFavorites();
      setSavedProperties(favorites);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = savedProperties.filter(property => {
    const matchesLocation = !locationFilter || property.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesPrice = !priceFilter || property.price <= parseInt(priceFilter);
    return matchesLocation && matchesPrice;
  });

  if (loading) {
    return (
      <Layout activeTab="search">
        <div className="bg-background min-h-screen desktop-nav-spacing flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading saved properties...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="search">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Saved Properties</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border border-border transition-colors ${
                  showFilters ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Filter size={20} />
              </button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{filteredProperties.length} saved properties</p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 py-4 bg-muted/20 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-2 py-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved properties found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or save some properties!</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1' : 'space-y-1'}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Saved;