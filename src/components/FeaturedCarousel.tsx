import React from 'react';
import { Star, MapPin, Crown } from 'lucide-react';

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: 'day' | 'week' | 'month' | 'year' | 'sale';
  imageUrl: string;
  rating: number;
  isSponsored?: boolean;
  sponsorName?: string;
}

interface FeaturedCarouselProps {
  properties: FeaturedProperty[];
  onPropertyClick?: (property: FeaturedProperty) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  properties,
  onPropertyClick,
}) => {
  const formatPrice = (price: number, duration: string) => {
    if (duration === 'sale') return `NGN ${price.toLocaleString()}`;
    return `NGN ${price.toLocaleString()}/${duration}`;
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Featured Properties</h2>
        <button className="text-primary text-sm font-medium">See all</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:overflow-visible">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex-shrink-0 w-64 bg-card border border-border rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow lg:w-full"
            onClick={() => onPropertyClick?.(property)}
          >
            {/* Smaller Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Sponsor Badge */}
              {property.isSponsored && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-sponsor text-sponsor-foreground px-2 py-1 rounded-full text-xs font-medium">
                  <Crown size={10} />
                  {property.sponsorName}
                </div>
              )}
              
              {/* Rating */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                <Star size={12} fill="currentColor" />
                {property.rating.toFixed(1)}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-card-foreground text-sm leading-tight mb-1 line-clamp-2">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                <MapPin size={10} />
                <span className="truncate">{property.location}</span>
              </div>
              
              <div className="font-semibold text-card-foreground text-lg">
                {formatPrice(property.price, property.duration)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;