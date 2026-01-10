import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import rentHomesImg from '@/assets/rent-homes.jpg';
import buyHomesImg from '@/assets/buy-homes.jpg';
import landPlotImg from '@/assets/land-plot.jpg';
import shortletImg from '@/assets/shortlet-apartment.jpg';
import servicesImg from '@/assets/services-team.jpg';
import relocationImg from '@/assets/relocation-service.jpg';

interface SearchHeaderProps {
  onSearch?: (query: string) => void;
  showFilters?: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  showFilters = false,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categoryTabs = [
    { id: 'homes', label: 'Homes', image: rentHomesImg, path: '/homes' },
    { id: 'shortlets', label: 'Shortlets', image: shortletImg, path: '/shortlets' },
    { id: 'services', label: 'Services', image: servicesImg, path: '/services' },
    { id: 'rent', label: 'Rent', image: rentHomesImg, path: '/rent' },
    { id: 'buy', label: 'Buy', image: buyHomesImg, path: '/buy' },
    { id: 'land', label: 'Land', image: landPlotImg, path: '/land' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="bg-background">
      {/* Search Bar - At Very Top */}
      <div className="px-4 pt-4 pb-2 border-b border-border/50">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Find your home"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="px-4 py-3 bg-muted/20 border-b border-border/50">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background">
                  <DollarSign size={16} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Min price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 text-sm bg-transparent border-none outline-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background">
                  <DollarSign size={16} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Max price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 text-sm bg-transparent border-none outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background">
              <Calendar size={16} className="text-muted-foreground" />
              <input
                type="date"
                className="flex-1 text-sm bg-transparent border-none outline-none"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <input
                type="date"
                className="flex-1 text-sm bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Category Navigation */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {categoryTabs.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="flex-shrink-0 px-4 py-2 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-colors"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;