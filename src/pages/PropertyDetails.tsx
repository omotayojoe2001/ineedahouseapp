import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Star, Phone, MessageCircle, Calendar, Shield, CheckCircle, Car, Waves, Dumbbell, ChefHat, Wifi, Snowflake, Droplets, Building, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PropertyService } from '@/services/propertyService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (propertyError) throw propertyError;
        
        console.log('🏠 Property data:', propertyData);
        console.log('👤 Property user_id:', propertyData.user_id);
        
        // Fetch owner profile separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, full_name, phone, created_at, avatar_url')
          .eq('user_id', propertyData.user_id)
          .single();
        
        console.log('📋 Profile query error:', profileError);
        console.log('👤 Profile data:', profileData);
        
        if (!profileError && profileData) {
          propertyData.profiles = profileData;
          console.log('✅ Profile attached to property');
        } else {
          console.log('❌ No profile found or error:', profileError);
        }
        
        console.log('🎯 Final property with profile:', propertyData);
        
        setProperty(propertyData);
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

  const propertyImages = property.images || property.property_images?.map((img: any) => img.image_url) || [
    '/src/assets/property-1.jpg',
    '/src/assets/property-2.jpg',
  ];

  const getAmenities = () => {
    const amenityList = [];
    if (property.parking) amenityList.push({ icon: Car, label: 'Parking' });
    if (property.swimming_pool) amenityList.push({ icon: Waves, label: 'Pool' });
    if (property.gym) amenityList.push({ icon: Dumbbell, label: 'Gym' });
    if (property.security_personnel) amenityList.push({ icon: Shield, label: 'Security' });
    if (property.air_conditioning) amenityList.push({ icon: Snowflake, label: 'AC' });
    if (property.furnished) amenityList.push({ icon: ChefHat, label: 'Furnished' });
    if (property.elevator) amenityList.push({ icon: Car, label: 'Elevator' });
    if (property.garden) amenityList.push({ icon: Waves, label: 'Garden' });
    if (property.internet || property.fiber_ready) amenityList.push({ icon: Wifi, label: 'WiFi' });
    if (property.backup_generator) amenityList.push({ icon: Shield, label: 'Generator' });
    if (property.borehole || property.treated_water) amenityList.push({ icon: Droplets, label: 'Water' });
    if (property.cctv_surveillance) amenityList.push({ icon: Shield, label: 'CCTV' });
    
    return amenityList.length > 0 ? amenityList : [
      { icon: Car, label: 'Parking' },
      { icon: Shield, label: 'Security' },
      { icon: ChefHat, label: 'Kitchen' },
      { icon: Wifi, label: 'WiFi' },
    ];
  };

  const amenities = getAmenities();

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
            <span>{property.address || property.location}</span>
          </div>
          {property.description && (
            <p className="text-muted-foreground mt-2">{property.description}</p>
          )}
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
            <span className="font-medium">{property.rating || '4.8'}</span>
            <span className="text-muted-foreground">({property.review_count || '0'} reviews)</span>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {property.verified ? 'Verified' : 'Listed'}
          </Badge>
        </div>

        {/* Highlights */}
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Top 10% of homes in this area</p>
        </div>
      </div>

      {/* Owner/Agent Section */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Hosted by {property.profiles ? `${property.profiles.first_name} ${property.profiles.last_name}` : 'Property Owner'}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={property.profiles?.avatar_url || ''} className="object-cover" />
              <AvatarFallback>
                {property.profiles ? 
                  `${property.profiles.first_name?.[0] || ''}${property.profiles.last_name?.[0] || ''}`.toUpperCase() : 
                  'PO'
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{property.profiles ? `${property.profiles.first_name} ${property.profiles.last_name}` : 'Property Owner'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">4.9</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Host
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Member since {property.profiles?.created_at ? new Date(property.profiles.created_at).getFullYear() : '2024'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            {property.profiles?.phone && (
              <Button variant="outline" size="sm" onClick={() => window.open(`tel:${property.profiles.phone}`)}>
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
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

      {/* Property Features & Details */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">Property Details</h2>
        
        {/* Building Information */}
        {(property.floor_level !== undefined || property.total_units_in_building) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">Building Information</h3>
            <div className="space-y-3 text-sm">
              {property.floor_level !== undefined && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Floor Level</span>
                  </div>
                  <span className="text-gray-600">{property.floor_level === 0 ? 'Ground floor' : `${property.floor_level}${property.floor_level === 1 ? 'st' : property.floor_level === 2 ? 'nd' : property.floor_level === 3 ? 'rd' : 'th'} floor`}</span>
                </div>
              )}
              {property.total_units_in_building && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Units in Building</span>
                  </div>
                  <span className="text-gray-600">{property.total_units_in_building}</span>
                </div>
              )}
              {property.building_condition && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Building Condition</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.building_condition.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interior Features */}
        {(property.living_room || property.dining_area || property.kitchen_cabinets) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">Interior Features</h3>
            <div className="space-y-3 text-sm">
              {property.living_room && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Living Room</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.living_room}</span>
                </div>
              )}
              {property.dining_area && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dining Area</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.dining_area}</span>
                </div>
              )}
              {property.kitchen_cabinets && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Kitchen Cabinets</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.kitchen_cabinets}</span>
                </div>
              )}
              {property.countertop && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Kitchen Counter</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.countertop}</span>
                </div>
              )}
              {property.heat_extractor && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Snowflake className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Kitchen Extractor</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.heat_extractor}</span>
                </div>
              )}
              {property.balcony_feature && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Balcony</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.balcony_feature}</span>
                </div>
              )}
              {property.storage && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Storage</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.storage.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security & Parking */}
        {(property.gated_compound || property.security_personnel || property.parking_spaces) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">Security & Parking</h3>
            <div className="space-y-3 text-sm">
              {property.gated_compound && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Gated Compound</span>
                  </div>
                  <span className="text-gray-600">Yes</span>
                </div>
              )}
              {property.security_personnel && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Security Guard</span>
                  </div>
                  <span className="text-gray-600">24/7 Security</span>
                </div>
              )}
              {property.cctv_surveillance && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">CCTV</span>
                  </div>
                  <span className="text-gray-600">Yes</span>
                </div>
              )}
              {property.parking_spaces && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Parking Spaces</span>
                  </div>
                  <span className="text-gray-600">{property.parking_spaces}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Utilities */}
        {(property.electricity_type || property.water_supply || property.internet_ready) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">Utilities & Services</h3>
            <div className="space-y-3 text-sm">
              {property.electricity_type && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Electricity</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.electricity_type === 'public' ? 'NEPA/PHCN' : property.electricity_type}</span>
                </div>
              )}
              {property.transformer && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Transformer</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.transformer}</span>
                </div>
              )}
              {property.generator_type && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Generator</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.generator_type.replace('-', ' ')}</span>
                </div>
              )}
              {property.water_supply && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Water Supply</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.water_supply}</span>
                </div>
              )}
              {property.internet_ready && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Internet</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.internet_ready.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* House Finishing */}
        {(property.pop_ceiling || property.tiled_floors) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">House Finishing</h3>
            <div className="space-y-3 text-sm">
              {property.pop_ceiling && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">POP Ceiling</span>
                  </div>
                  <span className="text-gray-600">Yes</span>
                </div>
              )}
              {property.tiled_floors && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tiled Floors</span>
                  </div>
                  <span className="text-gray-600">Yes</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legal Documents */}
        {(property.certificate_of_occupancy || property.deed_of_assignment) && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">Legal Documents</h3>
            <div className="space-y-3 text-sm">
              {property.certificate_of_occupancy && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Certificate of Occupancy</span>
                  </div>
                  <span className="text-gray-600">Available</span>
                </div>
              )}
              {property.deed_of_assignment && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Deed of Assignment</span>
                  </div>
                  <span className="text-gray-600">Available</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tenant Preferences - Always show this section */}
        <div className="mb-6">
          <h3 className="font-semibold text-base mb-3">Tenant Preferences</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Allow Pets?</span>
              </div>
              <span className="text-gray-600 capitalize">
                {property.allows_pets === 'yes' ? 'Yes, pets allowed' : 
                 property.allows_pets === 'no' ? 'No pets' : 
                 property.allows_pets === 'small-pets' ? 'Only small pets' : 
                 property.allows_pets ? property.allows_pets.replace('-', ' ') : 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Preferred Tenant Type</span>
              </div>
              <span className="text-gray-600 capitalize">
                {property.tenant_preference ? property.tenant_preference.replace('-', ' ') : 'No preference'}
              </span>
            </div>
          </div>
        </div>
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
            <span className="font-semibold">₦{property.price?.toLocaleString() || property.annual_rent?.toLocaleString()}</span>
          </div>
          {property.service_charge && (
            <div className="flex justify-between">
              <span>Service charge</span>
              <span>₦{property.service_charge.toLocaleString()}</span>
            </div>
          )}
          {property.security_deposit && (
            <div className="flex justify-between">
              <span>Security deposit</span>
              <span>₦{property.security_deposit.toLocaleString()}</span>
            </div>
          )}
          {property.agreement_fee && (
            <div className="flex justify-between">
              <span>Agreement fee</span>
              <span>₦{property.agreement_fee.toLocaleString()}</span>
            </div>
          )}
          {property.legal_fee && (
            <div className="flex justify-between">
              <span>Legal fee</span>
              <span>₦{property.legal_fee.toLocaleString()}</span>
            </div>
          )}
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
            <span className="font-medium">{property.rating || '4.8'}</span>
            <span className="text-muted-foreground">({property.review_count || '0'} reviews)</span>
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