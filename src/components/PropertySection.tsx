import React from 'react';
import { ChevronRight, Heart, Star } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  duration: string;
  rating: number;
  imageUrl: string;
  badge?: string;
  isFavorite?: boolean;
  location?: string;
}

interface PropertySectionProps {
  title: string;
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onFavoriteToggle?: (propertyId: string) => void;
}

const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  properties,
  onPropertyClick,
  onFavoriteToggle,
}) => {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="px-3 md:px-4 mb-3 md:mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-foreground">{title}</h2>
          <button 
            className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            onClick={() => {
              const sectionSlug = title.toLowerCase().replace(/\s+/g, '-');
              window.location.href = `/category/${sectionSlug}`;
            }}
          >
            See all
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
      
      {/* Property Cards Carousel */}
      <div className="px-3 md:px-4">
        <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-4 xl:gap-6 lg:overflow-visible">
          {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-40 md:w-48 cursor-pointer lg:w-full"
                onClick={() => onPropertyClick?.(property)}
              >
              {/* Property Image */}
              <div className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-3">
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge */}
                {property.badge && (
                  <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-white text-foreground px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {property.badge}
                  </div>
                )}
                
                {/* Heart Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle?.(property.id);
                  }}
                  className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Heart 
                    size={16} 
                    className={`md:w-5 md:h-5 ${property.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
                  />
                </button>
              </div>
              
              {/* Property Info */}
              <div className="space-y-1">
                <h3 className="font-medium text-foreground text-xs md:text-sm">{property.title}</h3>
                {property.location && (
                  <p className="text-xs text-muted-foreground">{property.location}</p>
                )}
                {/* Category Badge */}
                <div className="mb-1">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {property.duration.includes('month') || property.duration.includes('day') || property.duration.includes('week') || property.duration.includes('year') ? 'For Rent' : 
                     property.duration.includes('total') || property.duration.includes('sale') ? 'For Sale' : 
                     property.duration.includes('service') ? 'Service' :
                     'Available'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={10} className="md:w-3 md:h-3 text-foreground fill-foreground" />
                  <span className="text-xs md:text-sm text-foreground">{property.rating}</span>
                </div>
                <p className="text-xs md:text-sm text-foreground">
                  <span className="font-semibold">NGN {property.price.toLocaleString()}</span> {property.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySection;