import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Star, Phone, MessageCircle, Calendar, Shield, CheckCircle, Car, Waves, Dumbbell, ChefHat, Wifi, Snowflake, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PropertyService } from '@/services/propertyService';
import { useToast } from '@/hooks/use-toast';

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const data = await PropertyService.getProperty(id);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    
    try {
      const newState = await PropertyService.toggleFavorite(id);
      setIsSaved(newState);
      toast({
        title: newState ? "Property Saved!" : "Property Removed",
        description: newState ? "Added to your saved properties" : "Removed from your saved properties",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Please sign in to save properties",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const propertyImages = property.property_images?.map((img: any) => img.image_url) || [
    '/src/assets/property-1.jpg',
    '/src/assets/property-2.jpg',
  ];

  const amenities = [
    { icon: Car, label: 'Parking' },
    { icon: Waves, label: 'Pool' },
    { icon: Dumbbell, label: 'Gym' },
    { icon: Shield, label: 'Security' },
    { icon: ChefHat, label: 'Kitchen' },
    { icon: Wifi, label: 'WiFi' },
    { icon: Snowflake, label: 'AC' },
    { icon: Droplets, label: 'Water' },
    { icon: Shield, label: 'Generator' },
    { icon: Car, label: 'Elevator' },
    { icon: Waves, label: 'Garden' },
    { icon: Dumbbell, label: 'Balcony' },
    { icon: ChefHat, label: 'Furnished' },
    { icon: Wifi, label: 'Internet' },
    { icon: Snowflake, label: 'Heating' },
    { icon: Droplets, label: 'Pet Friendly' },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      date: 'March 2024',
      comment: 'Amazing property! The location is perfect and the owner was very responsive. Highly recommended!'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      rating: 4,
      date: 'February 2024',
      comment: 'Great place to stay. Clean, comfortable, and exactly as described. Would definitely book again.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Image Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {propertyImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-80">
                  <img 
                    src={image} 
                    alt={`Property view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Overlay Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex}/{propertyImages.length}
        </div>
      </div>

      {/* Property Overview */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Property Type</span>
            <p className="font-medium">{property.property_type || property.category}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Size</span>
            <p className="font-medium">
              {property.bedrooms && property.bathrooms 
                ? `${property.bedrooms} bed, ${property.bathrooms} bath`
                : property.area_sqm 
                ? `${property.area_sqm} sqm`
                : 'Contact for details'
              }
            </p>
          </div>
        </div>

        {/* Rating & Highlights */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground">(124 reviews)</span>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>

        {/* Highlights */}
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Top 10% of homes in this area</p>
        </div>
      </div>

      {/* Owner/Agent Section */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Hosted by David Okafor</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback>DO</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">David Okafor</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Agent
                </Badge>
                <span className="text-xs text-muted-foreground">3 years hosting</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">What this place offers</h2>
        <div className="grid grid-cols-2 gap-3">
          {amenities.slice(0, showAllAmenities ? amenities.length : 8).map((amenity, index) => (
            <div key={index} className="flex items-center gap-3">
              <amenity.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{amenity.label}</span>
            </div>
          ))}
        </div>
        {amenities.length > 8 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
          >
            {showAllAmenities ? 'Show less amenities' : `Show all ${amenities.length} amenities`}
          </Button>
        )}
      </div>

      {/* Inspection Option - Unique Feature */}
      <div className="p-4 border-t border-border">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Request Property Inspection</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Hire a trusted local inspector to verify this property before payment
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Inspection fee: ₦5,000 - ₦15,000
                </p>
                <Button 
                  className="mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/property-inspection/${id}`)}
                >
                  Request Inspection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Pricing & Availability</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Monthly rent</span>
            <span className="font-semibold">₦150,000</span>
          </div>
          <div className="flex justify-between">
            <span>Service charge</span>
            <span>₦25,000</span>
          </div>
          <div className="flex justify-between">
            <span>Security deposit</span>
            <span>₦300,000</span>
          </div>
        </div>
        <Button className="w-full mt-4">
          <Calendar className="h-4 w-4 mr-2" />
          Check Availability
        </Button>
      </div>

      {/* Reviews */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reviews</h2>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{review.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          Show all reviews
        </Button>
      </div>

      {/* Location Map Placeholder */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Location</h2>
        <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>Map preview</p>
            <p className="text-sm">Lekki Phase 1, Lagos</p>
          </div>
        </div>
      </div>

      {/* Sticky Footer CTA */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">₦{property.price?.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{property.duration || 'per month'}</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary-hover">
            Contact Owner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;