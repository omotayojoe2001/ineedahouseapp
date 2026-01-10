import React from 'react';
import { MapPin, Bed, Bath, Square, Star, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: 'day' | 'week' | 'month' | 'year' | 'sale' | 'service' | 'room' | 'item' | 'delivery' | 'total';
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  rating?: number;
  imageUrl: string;
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  verified?: boolean;
  badge?: string;
  isFavorite?: boolean;
  category?: string;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  duration,
  bedrooms,
  bathrooms,
  sqft,
  rating,
  imageUrl,
  isFeatured,
  isSponsored,
  sponsorName,
  verified,
  badge,
  isFavorite,
  onClick,
  onFavoriteToggle,
}) => {
  const navigate = useNavigate();
  const formatPrice = (price: number, duration: string) => {
    switch (duration) {
      case 'sale':
      case 'total':
        return `₦${price.toLocaleString()}`;
      case 'service':
        return `₦${price.toLocaleString()} per service`;
      case 'room':
        return `₦${price.toLocaleString()} per room`;
      case 'item':
        return `₦${price.toLocaleString()} per item`;
      case 'delivery':
        return `₦${price.toLocaleString()} per delivery`;
      default:
        return `₦${price.toLocaleString()}/${duration}`;
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'day': return 'per night';
      case 'week': return 'per week';
      case 'month': return 'per month';
      case 'year': return 'per year';
      case 'sale': return 'for sale';
      case 'total': return 'total price';
      case 'service': return 'per service';
      case 'room': return 'per room';
      case 'item': return 'per item';
      case 'delivery': return 'per delivery';
      default: return duration;
    }
  };

  return (
    <div 
      className="property-card cursor-pointer relative w-full"
      onClick={onClick || (() => navigate(`/property/${id}`))}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
          >
            <Heart 
              size={16} 
              className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
            />
          </button>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {verified && (
            <div className="flex items-center gap-1 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium">
              <Shield size={12} />
              Verified
            </div>
          )}
          
          {badge && (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
              {badge}
            </div>
          )}
          
          {isFeatured && (
            <div className="featured-badge">
              Featured
            </div>
          )}
        </div>
        
        {/* Sponsor Ribbon */}
        {isSponsored && sponsorName && (
          <div className="sponsor-ribbon">
            {sponsorName}
          </div>
        )}
        
        {/* Rating */}
        {rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
            <Star size={12} fill="currentColor" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-card-foreground text-base leading-tight mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin size={14} />
            {location}
          </div>
        </div>
        
        {/* Property Details */}
        {(bedrooms || bathrooms || sqft) && (
          <div className="flex items-center gap-4 mb-3 text-muted-foreground text-sm">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <Bed size={14} />
                {bedrooms}
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath size={14} />
                {bathrooms}
              </div>
            )}
            {sqft && (
              <div className="flex items-center gap-1">
                <Square size={14} />
                {sqft.toLocaleString()} sqft
              </div>
            )}
          </div>
        )}
        
        {/* Price & Action */}
        <div className="space-y-3">
          <div>
            <div className="font-semibold text-card-foreground text-lg">
              {formatPrice(price, duration)}
            </div>
            <div className="text-muted-foreground text-xs">
              {getDurationLabel(duration)}
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (duration === 'sale' || duration === 'total') {
                onClick ? onClick() : navigate(`/property/${id}`);
              } else if (duration === 'service' || duration === 'room' || duration === 'item' || duration === 'delivery') {
                onClick ? onClick() : navigate(`/property/${id}`);
              } else {
                navigate(`/property-inspection/${id}`);
              }
            }}
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-primary-hover active:scale-95"
          >
            {duration === 'sale' || duration === 'total' ? 'View Details' : 
             duration === 'service' || duration === 'room' || duration === 'item' || duration === 'delivery' ? 'Book Service' : 
             'Request Inspection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;