import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Home, Building, MapPin, Car, Paintbrush, Package, Wrench, Store, Calendar } from 'lucide-react';
import rentHomesImg from '@/assets/rent-homes.jpg';
import buyHomesImg from '@/assets/buy-homes.jpg';
import landPlotImg from '@/assets/land-plot.jpg';
import shortletImg from '@/assets/shortlet-apartment.jpg';
import servicesImg from '@/assets/services-team.jpg';
import relocationImg from '@/assets/relocation-service.jpg';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRequired: () => void;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
  type: 'property' | 'service';
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onAuthRequired }) => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      id: 'rent',
      title: 'Rent Property',
      description: 'List your property for rent',
      icon: Home,
      image: rentHomesImg,
      type: 'property'
    },
    {
      id: 'sale',
      title: 'Sell Property',
      description: 'List your property for sale',
      icon: Building,
      image: buyHomesImg,
      type: 'property'
    },
    {
      id: 'land',
      title: 'Sell/Rent Land',
      description: 'List land for sale or rent',
      icon: MapPin,
      image: landPlotImg,
      type: 'property'
    },
    {
      id: 'shortlet',
      title: 'Shortlet Apartment',
      description: 'List short-term rental',
      icon: Home,
      image: shortletImg,
      type: 'property'
    },
    {
      id: 'relocation',
      title: 'Car Delivery & Relocation',
      description: 'Vehicle transport and moving services',
      icon: Car,
      image: relocationImg,
      type: 'service'
    },
    {
      id: 'painting',
      title: 'Painting Services',
      description: 'Professional painting and decoration',
      icon: Paintbrush,
      image: servicesImg,
      type: 'service'
    },
    {
      id: 'furniture',
      title: 'Furniture Services',
      description: 'Furniture delivery and assembly',
      icon: Package,
      image: servicesImg,
      type: 'service'
    },
    {
      id: 'shop',
      title: 'Shop/Store',
      description: 'Retail spaces and commercial shops',
      icon: Store,
      image: buyHomesImg,
      type: 'property'
    },
    {
      id: 'event',
      title: 'Event Centre',
      description: 'Event halls and function venues',
      icon: Calendar,
      image: servicesImg,
      type: 'property'
    },
    {
      id: 'other',
      title: 'Other Services',
      description: 'General services and maintenance',
      icon: Wrench,
      image: servicesImg,
      type: 'service'
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    onClose();
    
    // Route to new Airbnb-style pages
    switch (categoryId) {
      case 'rent':
        navigate('/create-rent-listing-new');
        break;
      case 'sale':
        navigate('/create-sale-listing-new');
        break;
      case 'shortlet':
        navigate('/create-shortlet-listing-new');
        break;
      case 'land':
        navigate('/create-sale-listing-new?type=land');
        break;
      case 'shop':
        navigate('/create-shop-listing-new');
        break;
      case 'event':
        navigate('/create-event-center-listing-new');
        break;
      case 'relocation':
      case 'painting':
      case 'furniture':
      case 'other':
        navigate(`/create-service-new?type=${categoryId}`);
        break;
      default:
        navigate('/create-listing');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col bg-background border-0 shadow-2xl mx-2 p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-8">
          <DialogTitle className="text-2xl font-bold mb-2">What would you like to list?</DialogTitle>
          <p className="text-primary-foreground/90">Choose the type of listing you want to create</p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  {/* Background Image */}
                  <div className="relative h-24 md:h-32 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                      <Icon size={16} className="text-primary md:w-5 md:h-5" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-2 md:p-4">
                    <h3 className="font-semibold text-foreground text-xs md:text-base mb-1 md:mb-2 group-hover:text-primary transition-colors leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-tight">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-border bg-muted/30">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Need help? Contact our support team</p>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingModal;