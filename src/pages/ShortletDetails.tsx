import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Star, Phone, MessageCircle, Calendar, Shield, CheckCircle, Car, Waves, Dumbbell, ChefHat, Wifi, Snowflake, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ShortletDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [shortlet, setShortlet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlet = async () => {
      if (!id) return;
      
      try {
        const { data: shortletData, error } = await supabase
          .from('shortlets')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Fetch owner profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, created_at, avatar_url')
          .eq('user_id', shortletData.user_id)
          .single();
        
        if (profileData) {
          shortletData.profiles = profileData;
        }
        
        setShortlet(shortletData);
      } catch (error) {
        console.error('Error fetching shortlet:', error);
        toast({
          title: "Error",
          description: "Failed to load shortlet details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShortlet();
  }, [id, toast]);

  const handleToggleFavorite = async () => {
    if (!id || !user) {
      toast({
        title: "Error",
        description: "Please sign in to save shortlets",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: existing } = await supabase
        .from('shortlet_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('shortlet_id', id)
        .single();

      if (existing) {
        await supabase
          .from('shortlet_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('shortlet_id', id);
        setIsSaved(false);
        toast({ title: "Shortlet Removed", description: "Removed from your saved shortlets" });
      } else {
        await supabase
          .from('shortlet_favorites')
          .insert({ user_id: user.id, shortlet_id: id });
        setIsSaved(true);
        toast({ title: "Shortlet Saved!", description: "Added to your saved shortlets" });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading shortlet details...</p>
        </div>
      </div>
    );
  }

  if (!shortlet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Shortlet Not Found</h1>
          <p className="text-muted-foreground mb-4">The shortlet you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shortlets')}>Browse Shortlets</Button>
        </div>
      </div>
    );
  }

  const shortletImages = shortlet.images || ['/src/assets/shortlet-apartment.jpg'];

  const getShortletAmenities = () => {
    const amenityList = [];
    if (shortlet.wifi) amenityList.push({ icon: Wifi, label: 'WiFi Internet' });
    if (shortlet.air_conditioning) amenityList.push({ icon: Snowflake, label: 'Air Conditioning' });
    if (shortlet.kitchen) amenityList.push({ icon: ChefHat, label: 'Fully Equipped Kitchen' });
    if (shortlet.cable_tv) amenityList.push({ icon: Car, label: 'Cable TV' });
    if (shortlet.parking) amenityList.push({ icon: Car, label: 'Free Parking' });
    if (shortlet.swimming_pool) amenityList.push({ icon: Waves, label: 'Swimming Pool' });
    if (shortlet.gym) amenityList.push({ icon: Dumbbell, label: 'Gym/Fitness Center' });
    if (shortlet.security_24_7) amenityList.push({ icon: Shield, label: '24/7 Security' });
    if (shortlet.backup_generator) amenityList.push({ icon: Shield, label: 'Backup Generator' });
    if (shortlet.laundry_service) amenityList.push({ icon: Droplets, label: 'Laundry Service' });
    if (shortlet.hot_water) amenityList.push({ icon: Droplets, label: 'Hot Water' });
    return amenityList;
  };

  const amenities = getShortletAmenities();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Image Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {shortletImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-80">
                  <img 
                    src={image} 
                    alt={`Shortlet view ${index + 1}`}
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
            <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white">
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
      </div>

      {/* Shortlet Overview */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{shortlet.title}</h1>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{shortlet.address || shortlet.location}</span>
          </div>
          {shortlet.description && (
            <p className="text-muted-foreground mt-2">{shortlet.description}</p>
          )}
        </div>

        {/* Property Details */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Property Type</span>
              <p className="font-medium">{shortlet.property_sub_type || shortlet.property_type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Max Guests</span>
              <p className="font-medium">{shortlet.max_guests ? `${shortlet.max_guests} guests` : 'Not specified'}</p>
            </div>
            {shortlet.bedrooms && (
              <div>
                <span className="text-muted-foreground">Bedrooms</span>
                <p className="font-medium">{shortlet.bedrooms}</p>
              </div>
            )}
            {shortlet.bathrooms && (
              <div>
                <span className="text-muted-foreground">Bathrooms</span>
                <p className="font-medium">{shortlet.bathrooms}</p>
              </div>
            )}
            {shortlet.area_sqm && (
              <div>
                <span className="text-muted-foreground">Area</span>
                <p className="font-medium">{shortlet.area_sqm} sqm</p>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Highlights */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {shortlet.verified ? 'Verified Host' : 'Listed'}
          </Badge>
          {shortlet.instant_booking && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Instant Book
            </Badge>
          )}
        </div>
      </div>

      {/* Host Section */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Hosted by {shortlet.profiles ? `${shortlet.profiles.first_name} ${shortlet.profiles.last_name}` : 'Host'}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={shortlet.profiles?.avatar_url || ''} className="object-cover" />
              <AvatarFallback>
                {shortlet.profiles ? 
                  `${shortlet.profiles.first_name?.[0] || ''}${shortlet.profiles.last_name?.[0] || ''}`.toUpperCase() : 
                  'H'
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{shortlet.profiles ? `${shortlet.profiles.first_name} ${shortlet.profiles.last_name}` : 'Host'}</p>
              <p className="text-sm text-muted-foreground">Shortlet Host</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Host
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Host since {shortlet.profiles?.created_at ? new Date(shortlet.profiles.created_at).getFullYear() : '2024'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            {shortlet.profiles?.phone && (
              <Button variant="outline" size="sm" onClick={() => window.open(`tel:${shortlet.profiles.phone}`)}>
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
        {amenities.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3">
                <amenity.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No amenities specified</p>
        )}
      </div>

      {/* Shortlet Rates & Booking */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3">Rates & Booking</h2>
        
        <div className="space-y-4">
          {/* Rates */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-3">Pricing</h3>
            <div className="space-y-2">
              {shortlet.daily_rate && (
                <div className="flex justify-between">
                  <span className="text-green-700">Daily rate</span>
                  <span className="font-semibold text-green-800">₦{shortlet.daily_rate.toLocaleString()}/night</span>
                </div>
              )}
              {shortlet.weekly_rate && (
                <div className="flex justify-between">
                  <span className="text-green-700">Weekly rate</span>
                  <span className="font-semibold text-green-800">₦{shortlet.weekly_rate.toLocaleString()}/week</span>
                </div>
              )}
              {shortlet.monthly_rate && (
                <div className="flex justify-between">
                  <span className="text-green-700">Monthly rate</span>
                  <span className="font-semibold text-green-800">₦{shortlet.monthly_rate.toLocaleString()}/month</span>
                </div>
              )}
              {shortlet.cleaning_fee && (
                <div className="flex justify-between">
                  <span className="text-green-700">Cleaning fee</span>
                  <span className="text-green-800">₦{shortlet.cleaning_fee.toLocaleString()}</span>
                </div>
              )}
              {shortlet.security_deposit && (
                <div className="flex justify-between">
                  <span className="text-green-700">Security deposit</span>
                  <span className="text-green-800">₦{shortlet.security_deposit.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Rules */}
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <h3 className="font-medium text-sm">Booking Rules</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {shortlet.minimum_stay && (
                <div>
                  <span className="text-muted-foreground">Min stay:</span>
                  <span className="ml-1 font-medium">{shortlet.minimum_stay} {shortlet.minimum_stay === 1 ? 'night' : 'nights'}</span>
                </div>
              )}
              {shortlet.maximum_stay && (
                <div>
                  <span className="text-muted-foreground">Max stay:</span>
                  <span className="ml-1 font-medium">{shortlet.maximum_stay} nights</span>
                </div>
              )}
              {shortlet.check_in_time && (
                <div>
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="ml-1 font-medium">{shortlet.check_in_time}</span>
                </div>
              )}
              {shortlet.check_out_time && (
                <div>
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="ml-1 font-medium">{shortlet.check_out_time}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* House Rules */}
          {shortlet.house_rules && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h3 className="font-medium text-sm text-yellow-800 mb-2">House Rules</h3>
              <p className="text-sm text-yellow-700">{shortlet.house_rules}</p>
            </div>
          )}
          
          {/* Guest Policies */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-medium text-sm text-blue-800 mb-2">Guest Policies</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Maximum guests:</span>
                <span>{shortlet.max_guests || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pets allowed:</span>
                <span className="capitalize">
                  {shortlet.allow_pets === 'yes' ? 'Yes' : 
                   shortlet.allow_pets === 'no' ? 'No' : 
                   shortlet.allow_pets === 'small-pets' ? 'Small pets only' : 
                   'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-4">
          <Calendar className="h-4 w-4 mr-2" />
          {shortlet.instant_booking ? 'Book Instantly' : 'Request to Book'}
        </Button>
      </div>

      {/* Nearby Attractions */}
      {shortlet.nearby_attractions && (
        <div className="p-4 border-t border-border">
          <h2 className="text-lg font-semibold mb-3">Nearby Attractions</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 text-sm">{shortlet.nearby_attractions}</p>
          </div>
        </div>
      )}

      {/* Sticky Footer CTA */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">
              ₦{shortlet.daily_rate?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary-hover">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShortletDetails;