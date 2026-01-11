import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Home, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchHeaderProps {
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  onFilterChange?: (filters: any) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  showFilters = false,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    propertyCategory: '',
    nearestCheckpoint: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });

  const searchSuggestions = [
    'Self contain in Lagos',
    'One bedroom apartment',
    'Houses for sale in Abuja',
    'Shortlet in Victoria Island',
    'Land for sale in Lekki',
    'Duplex for rent',
    'Studio apartment Yaba',
    'Commercial property',
  ];

  const propertyTypes = [
    'Self Contain', 'Apartment', 'Duplex', 'Bungalow', 'Flat', 'Studio', 'Penthouse', 'Villa', 'Townhouse'
  ];

  const locations = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 
    'Kaduna', 'Jos', 'Warri', 'Owerri', 'Enugu', 'Calabar'
  ];

  const propertyCategories = [
    'Residential', 'Commercial', 'Industrial', 'Mixed Use', 'Land/Plot'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    onSearch?.(searchQuery);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    console.log('Filter changed:', key, '=', value);
    console.log('All filters:', newFilters);
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-background">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2 border-b border-border/50">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
                onSearch?.(e.target.value); // Call search immediately
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </form>
        
        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg mt-1 shadow-lg z-10">
            {searchSuggestions
              .filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 5)
              .map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    onSearch?.(suggestion);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm border-b border-border last:border-b-0"
                >
                  {suggestion}
                </button>
              ))
            }
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="px-4 py-3 bg-muted/20 border-b border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <Home size={14} className="text-muted-foreground" />
                  <SelectValue placeholder="Property Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.propertyCategory} onValueChange={(value) => handleFilterChange('propertyCategory', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {propertyCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <input
                type="text"
                placeholder="Nearest Checkpoint"
                value={filters.nearestCheckpoint}
                onChange={(e) => handleFilterChange('nearestCheckpoint', e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5+">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="4">4 Bathrooms</SelectItem>
                <SelectItem value="5+">5+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;