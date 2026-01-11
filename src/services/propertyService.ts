import { supabase } from '@/integrations/supabase/client';

export interface PropertyData {
  title: string;
  description?: string;
  category: 'rent' | 'sale' | 'land' | 'shortlet' | 'service' | 'shop' | 'event_center';
  property_type?: string;
  price: number;
  duration?: string;
  location: string;
  address?: string;
  street_address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  guest_toilet?: string;
  total_rooms?: number;
  area_sqm?: number;
  
  // Location details
  city?: string;
  area?: string;
  street?: string;
  nearby_landmarks?: string;
  
  // Rent-specific pricing
  rent_type?: 'daily' | 'weekly' | 'monthly' | 'annual';
  annual_rent?: number;
  security_deposit?: number;
  service_charge?: number;
  annual_service_charge?: number;
  agreement_fee?: number;
  commission_fee?: number;
  legal_fee?: number;
  caution_fee?: number;
  agency_fee?: number;
  agency_fee_percentage?: number;
  legal_fee_percentage?: number;
  inspection_fee?: number;
  other_fees?: Array<{ name: string; amount: number }>;
  total_upfront_cost?: number;
  
  // Building details
  building_type?: string;
  floor_level?: string;
  total_units_in_building?: number;
  building_age?: number;
  property_condition?: 'new' | 'excellent' | 'good' | 'fair' | 'needs_renovation';
  
  // Interior Features
  living_room?: string;
  dining_area?: string;
  kitchen_cabinets?: string;
  countertop?: string;
  heat_extractor?: string;
  balcony?: string;
  storage?: string;
  
  // Utilities & Infrastructure
  electricity_type?: string;
  transformer?: string;
  generator?: string;
  water_supply?: string;
  internet_ready?: string;
  
  // Security & Parking
  gated_compound?: string;
  security_24_7?: string;
  cctv?: string;
  parking_spaces?: string;
  
  // Finishing & Legal
  pop_ceiling?: string;
  tiled_floors?: string;
  building_condition?: string;
  certificate_of_occupancy?: string;
  deed_of_assignment?: string;
  building_plan?: string;
  
  // Legacy fields (keeping for compatibility)
  furnished?: boolean;
  parking?: boolean;
  visitor_parking?: boolean;
  security?: boolean;
  security_personnel?: boolean;
  cctv_surveillance?: boolean;
  access_control?: boolean;
  public_power?: boolean;
  dedicated_transformer?: boolean;
  backup_generator?: boolean;
  borehole?: boolean;
  treated_water?: boolean;
  internet?: boolean;
  fiber_ready?: boolean;
  waste_management?: string;
  modern_fittings?: boolean;
  freshly_painted?: boolean;
  
  // Additional amenities
  gym?: boolean;
  swimming_pool?: boolean;
  garden?: boolean;
  elevator?: boolean;
  air_conditioning?: boolean;
  heating?: boolean;
  pet_friendly?: boolean;
  smoking_allowed?: boolean;
  
  // Dates and terms
  available_from?: string;
  available_to?: string;
  minimum_stay?: number;
  maximum_stay?: number;
  lease_terms?: string;
  pet_policy?: string;
  utility_bills_included?: boolean;
  
  // Contact
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  
  // Media
  images?: string[];
  video_url?: string;
  virtual_tour_url?: string;
  documents?: string[];
  
  // Metadata
  featured?: boolean;
  verified?: boolean;
  status?: 'active' | 'inactive' | 'pending' | 'sold' | 'rented';
}

export interface ServiceData {
  title: string;
  description?: string;
  service_type: string;
  price?: number;
  price_type?: 'fixed' | 'hourly' | 'daily' | 'per_item' | 'per_service';
  location: string;
  service_areas?: string[];
  availability?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  images?: string[];
}

export class PropertyService {
  static async createProperty(propertyData: PropertyData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          user_id: user.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      if (propertyData.images && propertyData.images.length > 0) {
        const imageInserts = propertyData.images.map((imageUrl, index) => ({
          property_id: property.id,
          image_url: imageUrl,
          is_primary: index === 0,
          order_index: index,
        }));

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      return property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async createService(serviceData: ServiceData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: service, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return service;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  static async getProperty(id: string) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(*),
          property_amenities(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  static async toggleFavorite(propertyId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('property_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('property_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from('property_favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });

        if (error) throw error;
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  static async getFavorites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('property_favorites')
        .select(`
          properties!inner(
            *,
            property_images(*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.properties) || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }
}