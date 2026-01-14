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
        // Try different tables based on the property type
        const tables = [
          { name: 'properties', redirect: null },
          { name: 'shortlets', redirect: '/shortlet' },
          { name: 'sale_properties', redirect: null },
          { name: 'shops', redirect: null },
          { name: 'services', redirect: null },
          { name: 'event_centers', redirect: null }
        ];

        let propertyData = null;
        let foundTable = null;

        for (const table of tables) {
          console.log(`Trying table: ${table.name} for ID: ${id}`);
          const { data, error } = await supabase
            .from(table.name)
            .select('*')
            .eq('id', id)
            .single();

          console.log(`Table ${table.name} result:`, { data, error });

          if (!error && data) {
            propertyData = data;
            foundTable = table;
            console.log(`✅ Found property in table: ${table.name}`);
            break;
          }
        }

        if (!propertyData) {
          throw new Error('Property not found in any table');
        }

        // If it's a shortlet, redirect to shortlet page
        if (foundTable?.redirect) {
          navigate(`${foundTable.redirect}/${id}`, { replace: true });
          return;
        }
        
        console.log('🏠 Property data loaded from DB:', propertyData);
        console.log('📊 Interior Features from DB:', {
          living_room: propertyData.living_room,
          dining_area: propertyData.dining_area,
          kitchen_cabinets: propertyData.kitchen_cabinets,
          countertop: propertyData.countertop,
          heat_extractor: propertyData.heat_extractor,
          balcony_feature: propertyData.balcony_feature,
          storage: propertyData.storage
        });
        console.log('⚡ Utilities from DB:', {
          electricity_type: propertyData.electricity_type,
          transformer: propertyData.transformer,
          generator_type: propertyData.generator_type,
          water_supply: propertyData.water_supply,
          internet_ready: propertyData.internet_ready
        });
        console.log('💰 Fees from DB:', {
          security_deposit: propertyData.security_deposit,
          service_charge: propertyData.service_charge,
          agreement_fee: propertyData.agreement_fee,
          legal_fee: propertyData.legal_fee
        });
        console.log('👥 Tenant Preferences from DB:', {
          allows_pets: propertyData.allows_pets,
          tenant_preference: propertyData.tenant_preference
        });
        
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

  const getPropertyType = () => {
    // Determine property type based on which table the data came from
    if (property.venue_type) return 'event_center';
    if (property.shop_type) return 'shop';
    if (property.service_type) return 'service';
    if (property.sale_price) return 'sale';
    if (property.daily_rate || property.weekly_rate || property.monthly_rate) return 'shortlet';
    return 'rental';
  };

  const propertyType = getPropertyType();

  const getAmenities = () => {
    const amenityList = [];
    
    if (propertyType === 'event_center') {
      // Only show event center amenities that were actually selected
      if (property.sound_system) amenityList.push({ icon: Wifi, label: 'Sound System' });
      if (property.professional_lighting) amenityList.push({ icon: Snowflake, label: 'Professional Lighting' });
      if (property.catering_kitchen) amenityList.push({ icon: ChefHat, label: 'Catering Kitchen' });
      if (property.stage_platform) amenityList.push({ icon: Building, label: 'Stage/Platform' });
      if (property.tables_chairs) amenityList.push({ icon: Home, label: 'Tables & Chairs' });
      if (property.restroom_facilities) amenityList.push({ icon: Droplets, label: 'Restroom Facilities' });
      if (property.wifi_internet) amenityList.push({ icon: Wifi, label: 'WiFi Internet' });
      if (property.air_conditioning) amenityList.push({ icon: Snowflake, label: 'Air Conditioning' });
      if (property.parking_spaces > 0) amenityList.push({ icon: Car, label: 'Parking Available' });
      if (property.security_24_7) amenityList.push({ icon: Shield, label: '24/7 Security' });
    } else if (propertyType === 'shop') {
      // Only show shop amenities that were actually selected
      if (property.customer_parking) amenityList.push({ icon: Car, label: 'Customer Parking' });
      if (property.security_24_7) amenityList.push({ icon: Shield, label: '24/7 Security' });
      if (property.power_supply) amenityList.push({ icon: Wifi, label: 'Reliable Power' });
      if (property.water_supply) amenityList.push({ icon: Droplets, label: 'Water Supply' });
      if (property.loading_bay) amenityList.push({ icon: Building, label: 'Loading Bay' });
      if (property.storage_room) amenityList.push({ icon: Home, label: 'Storage Room' });
      if (property.display_windows) amenityList.push({ icon: Building, label: 'Display Windows' });
      if (property.signage_space) amenityList.push({ icon: Building, label: 'Signage Space' });
      if (property.customer_restroom) amenityList.push({ icon: Droplets, label: 'Customer Restroom' });
      if (property.air_conditioning) amenityList.push({ icon: Snowflake, label: 'Air Conditioning' });
    } else if (propertyType === 'shortlet') {
      // Only show shortlet amenities that were actually selected
      if (property.wifi) amenityList.push({ icon: Wifi, label: 'WiFi Internet' });
      if (property.air_conditioning) amenityList.push({ icon: Snowflake, label: 'Air Conditioning' });
      if (property.kitchen) amenityList.push({ icon: ChefHat, label: 'Fully Equipped Kitchen' });
      if (property.cable_tv) amenityList.push({ icon: Wifi, label: 'Cable TV' });
      if (property.parking) amenityList.push({ icon: Car, label: 'Free Parking' });
      if (property.swimming_pool) amenityList.push({ icon: Waves, label: 'Swimming Pool' });
      if (property.gym) amenityList.push({ icon: Dumbbell, label: 'Gym/Fitness Center' });
      if (property.security_24_7) amenityList.push({ icon: Shield, label: '24/7 Security' });
      if (property.backup_generator) amenityList.push({ icon: Wifi, label: 'Backup Generator' });
      if (property.laundry_service) amenityList.push({ icon: Droplets, label: 'Laundry Service' });
      if (property.hot_water) amenityList.push({ icon: Droplets, label: 'Hot Water' });
    } else if (propertyType === 'rental') {
      // Only show rental amenities that were actually selected during creation
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
    }
    // For sale properties and services, don't show amenities section at all
    
    return amenityList;
  };

  const amenities = getAmenities();

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
          {/* Show LGA and State separately */}
          {property.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 ml-5">
              <span className="font-medium">{property.location}</span>
            </div>
          )}
          {property.description && (
            <p className="text-muted-foreground mt-2">{property.description}</p>
          )}
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Property Type</span>
            <p className="font-medium">
              {propertyType === 'event_center' ? property.venue_sub_type || 'Event Center' :
               propertyType === 'shop' ? property.shop_sub_type || 'Shop/Store' :
               propertyType === 'service' ? property.service_type || 'Service' :
               propertyType === 'sale' ? property.property_sub_type || 'For Sale' :
               propertyType === 'shortlet' ? property.property_sub_type || 'Shortlet' :
               property.property_type || property.category}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">
              {propertyType === 'event_center' ? 'Capacity' :
               propertyType === 'shop' ? 'Floor Area' :
               propertyType === 'service' ? 'Experience' :
               propertyType === 'sale' ? 
                 (property.bedrooms ? 'Bedrooms' : 'Land Size') :
               'Size'}
            </span>
            <p className="font-medium">
              {propertyType === 'event_center' ? 
                (property.guest_capacity ? `Up to ${property.guest_capacity} guests` : 'Contact for capacity') :
               propertyType === 'shop' ? 
                (property.floor_area_sqft ? `${property.floor_area_sqft} sqft` : 'Contact for details') :
               propertyType === 'service' ? 
                (property.experience_years ? `${property.experience_years} years` : 'Contact for details') :
               propertyType === 'sale' ? 
                (property.bedrooms ? `${property.bedrooms} bedrooms` : 
                 property.land_size ? `${property.land_size} sqm` : 'Contact for details') :
               property.bedrooms && property.bathrooms ? 
                `${property.bedrooms} bed, ${property.bathrooms} bath` :
               property.area_sqm ? 
                `${property.area_sqm} sqm` : 
                'Contact for details'
              }
            </p>
          </div>
        </div>

        {/* Rating & Highlights */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {property.verified ? 'Verified' : 'Listed'}
          </Badge>
        </div>

        {/* Highlights */}
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Verified Property</p>
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
              <p className="text-sm text-muted-foreground">Contact for details</p>
              <div className="flex items-center gap-2 mt-1">
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
            {property.profiles?.whatsapp_number && (
              <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100" onClick={() => window.open(`https://wa.me/${property.profiles.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank')}>
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Amenities - Only show if there are actual amenities */}
      {amenities.length > 0 && (
        <div className="p-4 border-t border-border">
          <h2 className="text-lg font-semibold mb-3">
            {propertyType === 'event_center' ? 'Venue Features' :
             propertyType === 'shop' ? 'Shop Features' :
             propertyType === 'shortlet' ? 'What this place offers' :
             'What this place offers'}
          </h2>
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
              {showAllAmenities ? 'Show less features' : `Show all ${amenities.length} features`}
            </Button>
          )}
        </div>
      )}

      {/* Property Features & Details */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">
          {propertyType === 'event_center' ? 'Venue Details' :
           propertyType === 'shop' ? 'Shop Details' :
           propertyType === 'service' ? 'Service Details' :
           propertyType === 'sale' ? 'Property Details' :
           'Property Details'}
        </h2>
        
        {/* Event Center Specific Details */}
        {propertyType === 'event_center' && (
          <>
            {/* Venue Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Venue Information</h3>
              <div className="space-y-3 text-sm">
                {property.venue_type && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Venue Type</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.venue_type.replace('_', ' ')}</span>
                  </div>
                )}
                {property.indoor_outdoor && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Setting</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.indoor_outdoor}</span>
                  </div>
                )}
                {property.guest_capacity && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Guest Capacity</span>
                    </div>
                    <span className="text-gray-600">Up to {property.guest_capacity} guests</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Policies */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Booking Policies</h3>
              <div className="space-y-3 text-sm">
                {property.minimum_booking && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Minimum Booking</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.minimum_booking}</span>
                  </div>
                )}
                {property.catering_allowed !== undefined && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <ChefHat className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Catering Allowed</span>
                    </div>
                    <span className="text-gray-600">{property.catering_allowed ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {property.alcohol_allowed !== undefined && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Alcohol Allowed</span>
                    </div>
                    <span className="text-gray-600">{property.alcohol_allowed ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {property.decoration_policy && (
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Decoration Policy</span>
                    </div>
                    <p className="text-gray-600 text-sm ml-7">{property.decoration_policy}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Shop Specific Details */}
        {propertyType === 'shop' && (
          <>
            {/* Shop Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Shop Information</h3>
              <div className="space-y-3 text-sm">
                {property.floor_area_sqft && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Floor Area</span>
                    </div>
                    <span className="text-gray-600">{property.floor_area_sqft} sqft</span>
                  </div>
                )}
                {property.frontage_ft && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Frontage</span>
                    </div>
                    <span className="text-gray-600">{property.frontage_ft} ft</span>
                  </div>
                )}
                {property.floor_level && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Floor Level</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.floor_level}</span>
                  </div>
                )}
                {property.suitable_business_types && property.suitable_business_types.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Suitable For</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.suitable_business_types[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business Environment */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Business Environment</h3>
              <div className="space-y-3 text-sm">
                {property.foot_traffic_level && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Foot Traffic</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.foot_traffic_level.replace('-', ' ')}</span>
                  </div>
                )}
                {property.operating_hours && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Operating Hours</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.operating_hours}</span>
                  </div>
                )}
                {property.neighboring_businesses && (
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Neighboring Businesses</span>
                    </div>
                    <p className="text-gray-600 text-sm ml-7">{property.neighboring_businesses}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Service Specific Details */}
        {propertyType === 'service' && (
          <>
            {/* Service Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Service Information</h3>
              <div className="space-y-3 text-sm">
                {property.experience_years && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Experience</span>
                    </div>
                    <span className="text-gray-600">{property.experience_years} years</span>
                  </div>
                )}
                {property.pricing && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pricing</span>
                    </div>
                    <span className="text-gray-600">{property.pricing}</span>
                  </div>
                )}
                {property.availability && (
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Availability</span>
                    </div>
                    <p className="text-gray-600 text-sm ml-7">{property.availability}</p>
                  </div>
                )}
                {property.certifications && (
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Certifications</span>
                    </div>
                    <p className="text-gray-600 text-sm ml-7">{property.certifications}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Sale Property Specific Details */}
        {propertyType === 'sale' && (
          <>
            {/* Property Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Property Information</h3>
              <div className="space-y-3 text-sm">
                {property.property_age && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Property Age</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.property_age.replace('-', ' ')}</span>
                  </div>
                )}
                {property.property_condition && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Condition</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.property_condition.replace('-', ' ')}</span>
                  </div>
                )}
                {property.occupancy_status && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Occupancy Status</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.occupancy_status.replace('-', ' ')}</span>
                  </div>
                )}
                {property.title_document && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Title Document</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.title_document.replace('-', ' ')}</span>
                  </div>
                )}
                {property.reason_for_selling && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Reason for Selling</span>
                    </div>
                    <span className="text-gray-600 capitalize">{property.reason_for_selling}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Shortlet Specific Details */}
        {propertyType === 'shortlet' && (
          <>
            {/* Booking Rules */}
            <div className="mb-6">
              <h3 className="font-semibold text-base mb-3">Booking Rules</h3>
              <div className="space-y-3 text-sm">
                {property.minimum_stay && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Minimum Stay</span>
                    </div>
                    <span className="text-gray-600">{property.minimum_stay} {property.minimum_stay === 1 ? 'night' : 'nights'}</span>
                  </div>
                )}
                {property.maximum_stay && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Maximum Stay</span>
                    </div>
                    <span className="text-gray-600">{property.maximum_stay} {property.maximum_stay === 1 ? 'night' : 'nights'}</span>
                  </div>
                )}
                {property.check_in_time && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Check-in Time</span>
                    </div>
                    <span className="text-gray-600">{property.check_in_time}</span>
                  </div>
                )}
                {property.check_out_time && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Check-out Time</span>
                    </div>
                    <span className="text-gray-600">{property.check_out_time}</span>
                  </div>
                )}
                {property.house_rules && (
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">House Rules</span>
                    </div>
                    <p className="text-gray-600 text-sm ml-7">{property.house_rules}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Building Information - Only for rental properties */}
        {propertyType === 'rental' && (property.floor_level !== undefined || property.total_units_in_building) && (
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

        {/* Interior Features - Only for rental properties */}
        {propertyType === 'rental' && (property.living_room || property.dining_area || property.kitchen_cabinets) && (
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

        {/* Security & Parking - Only for rental properties */}
        {propertyType === 'rental' && (property.gated_compound || property.security_personnel || property.parking_spaces) && (
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

        {/* Utilities - Only for rental properties */}
        {propertyType === 'rental' && (property.electricity_type || property.water_supply || property.internet_ready) && (
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
              {property.transformer !== undefined && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Transformer</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.transformer ? 'Dedicated' : 'Shared'}</span>
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
              {property.internet_ready !== undefined && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Internet</span>
                  </div>
                  <span className="text-gray-600 capitalize">{property.internet_ready ? 'Fiber/Cable Ready' : 'Not Available'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* House Finishing - Only for rental properties */}
        {propertyType === 'rental' && (property.pop_ceiling || property.tiled_floors) && (
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

        {/* Legal Documents - Only for rental properties */}
        {propertyType === 'rental' && (property.certificate_of_occupancy || property.deed_of_assignment) && (
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

        {/* Tenant/Guest Preferences - Show only for rental and shortlet */}
        {(propertyType === 'rental' || propertyType === 'shortlet') && (
          <div className="mb-6">
            <h3 className="font-semibold text-base mb-3">
              {propertyType === 'shortlet' ? 'Guest Policies' : 'Tenant Preferences'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Allow Pets?</span>
                </div>
                <span className="text-gray-600 capitalize">
                  {property.allow_pets === 'yes' || property.allows_pets === 'yes' ? 'Yes, pets allowed' : 
                   property.allow_pets === 'no' || property.allows_pets === 'no' ? 'No pets' : 
                   property.allow_pets === 'small-pets' || property.allows_pets === 'small-pets' ? 'Only small pets' : 
                   property.allow_pets || property.allows_pets ? (property.allow_pets || property.allows_pets).replace('-', ' ') : 'Not specified'}
                </span>
              </div>
              {propertyType !== 'shortlet' && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Preferred Tenant Type</span>
                  </div>
                  <span className="text-gray-600 capitalize">
                    {property.tenant_preference ? property.tenant_preference.replace('-', ' ') : 'No preference'}
                  </span>
                </div>
              )}
              {propertyType === 'shortlet' && property.max_guests && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Maximum Guests</span>
                  </div>
                  <span className="text-gray-600">
                    {property.max_guests} {property.max_guests === 1 ? 'person' : 'people'}
                  </span>
                </div>
              )}
            </div>
          </div>
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
        <h2 className="text-lg font-semibold mb-3">
          {propertyType === 'event_center' ? 'Venue Rates' :
           propertyType === 'shop' ? 'Rental Terms' :
           propertyType === 'service' ? 'Service Pricing' :
           propertyType === 'sale' ? 'Sale Price' :
           propertyType === 'shortlet' ? 'Rates & Fees' :
           'Pricing & Availability'}
        </h2>
        
        <div className="space-y-2">
          {/* Event Center Pricing */}
          {propertyType === 'event_center' && (
            <>
              {property.hourly_rate && (
                <div className="flex justify-between">
                  <span>Hourly rate</span>
                  <span className="font-semibold">₦{property.hourly_rate.toLocaleString()}</span>
                </div>
              )}
              {property.daily_rate && (
                <div className="flex justify-between">
                  <span>Daily rate</span>
                  <span className="font-semibold">₦{property.daily_rate.toLocaleString()}</span>
                </div>
              )}
              {property.weekend_rate && (
                <div className="flex justify-between">
                  <span>Weekend rate</span>
                  <span className="font-semibold">₦{property.weekend_rate.toLocaleString()}</span>
                </div>
              )}
              {property.security_deposit && (
                <div className="flex justify-between">
                  <span>Security deposit</span>
                  <span>₦{property.security_deposit.toLocaleString()}</span>
                </div>
              )}
            </>
          )}

          {/* Shop Pricing */}
          {propertyType === 'shop' && (
            <>
              {property.monthly_rent && (
                <div className="flex justify-between">
                  <span>Monthly rent</span>
                  <span className="font-semibold">₦{property.monthly_rent.toLocaleString()}</span>
                </div>
              )}
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
            </>
          )}

          {/* Service Pricing */}
          {propertyType === 'service' && (
            <>
              {property.pricing && (
                <div className="flex justify-between">
                  <span>Service pricing</span>
                  <span className="font-semibold">{property.pricing}</span>
                </div>
              )}
            </>
          )}

          {/* Sale Pricing */}
          {propertyType === 'sale' && (
            <>
              {property.sale_price && (
                <div className="flex justify-between">
                  <span>Sale price</span>
                  <span className="font-semibold">₦{property.sale_price.toLocaleString()}</span>
                </div>
              )}
              {property.price_negotiable && (
                <div className="flex justify-between">
                  <span>Price negotiable</span>
                  <span className="text-green-600">Yes</span>
                </div>
              )}
            </>
          )}

          {/* Shortlet Pricing */}
          {propertyType === 'shortlet' && (
            <>
              {property.daily_rate && (
                <div className="flex justify-between">
                  <span>Daily rate</span>
                  <span className="font-semibold">₦{property.daily_rate.toLocaleString()}</span>
                </div>
              )}
              {property.weekly_rate && (
                <div className="flex justify-between">
                  <span>Weekly rate</span>
                  <span className="font-semibold">₦{property.weekly_rate.toLocaleString()}</span>
                </div>
              )}
              {property.monthly_rate && (
                <div className="flex justify-between">
                  <span>Monthly rate</span>
                  <span className="font-semibold">₦{property.monthly_rate.toLocaleString()}</span>
                </div>
              )}
              {property.cleaning_fee && (
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>₦{property.cleaning_fee.toLocaleString()}</span>
                </div>
              )}
              {property.security_deposit && (
                <div className="flex justify-between">
                  <span>Security deposit</span>
                  <span>₦{property.security_deposit.toLocaleString()}</span>
                </div>
              )}
            </>
          )}

          {/* Regular Rental Pricing */}
          {propertyType === 'rental' && (
            <>
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
              <div className="flex justify-between pt-3 mt-3 border-t-2 border-gray-300">
                <span className="font-bold text-lg">Total Initial Payment</span>
                <span className="font-bold text-lg text-primary">₦{(
                  (property.price || property.annual_rent || 0) +
                  (property.service_charge || 0) +
                  (property.security_deposit || 0) +
                  (property.agreement_fee || 0) +
                  (property.legal_fee || 0)
                ).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
        
        <Button className="w-full mt-4">
          <Calendar className="h-4 w-4 mr-2" />
          {propertyType === 'event_center' ? 'Check Availability' :
           propertyType === 'shop' ? 'Inquire About Shop' :
           propertyType === 'service' ? 'Book Service' :
           propertyType === 'sale' ? 'Schedule Viewing' :
           propertyType === 'shortlet' ? 'Check Availability' :
           'Check Availability'}
        </Button>
      </div>

      {/* Reviews */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reviews</h2>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          <p>No reviews yet</p>
          <p className="text-sm mt-1">Be the first to review this property</p>
        </div>
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {propertyType === 'event_center' ? 
                  (property.daily_rate ? `₦${property.daily_rate.toLocaleString()}` : 'Contact for rates') :
                 propertyType === 'shop' ? 
                  (property.monthly_rent ? `₦${property.monthly_rent.toLocaleString()}` : 'Contact for rates') :
                 propertyType === 'service' ? 
                  (property.pricing || 'Contact for rates') :
                 propertyType === 'sale' ? 
                  (property.sale_price ? `₦${property.sale_price.toLocaleString()}` : 'Contact for price') :
                 propertyType === 'shortlet' ? 
                  (property.daily_rate ? `₦${property.daily_rate.toLocaleString()}` : 'Contact for rates') :
                 `₦${property.price?.toLocaleString()}`
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {propertyType === 'event_center' ? 'per day' :
                 propertyType === 'shop' ? 'per month' :
                 propertyType === 'service' ? 'service rate' :
                 propertyType === 'sale' ? 'sale price' :
                 propertyType === 'shortlet' ? 'per night' :
                 property.duration || 'per month'}
              </p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary-hover">
              {propertyType === 'event_center' ? 'Book Venue' :
               propertyType === 'shop' ? 'Contact Owner' :
               propertyType === 'service' ? 'Book Service' :
               propertyType === 'sale' ? 'Contact Seller' :
               propertyType === 'shortlet' ? 'Book Now' :
               'Contact Owner'}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/messages')}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            {property.profiles?.phone && (
              <Button size="sm" variant="outline" onClick={() => window.open(`tel:${property.profiles.phone}`)}>
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
            {property.profiles?.whatsapp_number ? (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(`https://wa.me/${property.profiles.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank')}>
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;