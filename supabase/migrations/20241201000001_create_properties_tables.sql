-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('rent', 'sale', 'land', 'shortlet', 'service', 'shop', 'event_center')),
  property_type TEXT,
  price DECIMAL(15,2) NOT NULL,
  duration TEXT,
  location TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(10,2),
  furnished BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  security BOOLEAN DEFAULT false,
  generator BOOLEAN DEFAULT false,
  water_supply BOOLEAN DEFAULT false,
  internet BOOLEAN DEFAULT false,
  gym BOOLEAN DEFAULT false,
  swimming_pool BOOLEAN DEFAULT false,
  garden BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  air_conditioning BOOLEAN DEFAULT false,
  heating BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  smoking_allowed BOOLEAN DEFAULT false,
  available_from DATE,
  available_to DATE,
  minimum_stay INTEGER,
  maximum_stay INTEGER,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  images TEXT[], -- Array of image URLs
  video_url TEXT,
  virtual_tour_url TEXT,
  documents TEXT[], -- Array of document URLs
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'sold', 'rented')),
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities table for flexible amenities
CREATE TABLE property_amenities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_name TEXT NOT NULL,
  amenity_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table for service-based listings
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  price DECIMAL(15,2),
  price_type TEXT CHECK (price_type IN ('fixed', 'hourly', 'daily', 'per_item', 'per_service')),
  location TEXT NOT NULL,
  service_areas TEXT[],
  availability TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  images TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create land_listings table for land-specific fields
CREATE TABLE land_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  land_type TEXT CHECK (land_type IN ('residential', 'commercial', 'agricultural', 'industrial', 'mixed')),
  land_use TEXT,
  title_document TEXT,
  survey_plan BOOLEAN DEFAULT false,
  deed_of_assignment BOOLEAN DEFAULT false,
  certificate_of_occupancy BOOLEAN DEFAULT false,
  building_approval BOOLEAN DEFAULT false,
  soil_test BOOLEAN DEFAULT false,
  topography TEXT,
  access_road BOOLEAN DEFAULT false,
  electricity_available BOOLEAN DEFAULT false,
  water_source TEXT,
  drainage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_centers table for event center specific fields
CREATE TABLE event_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  capacity INTEGER,
  indoor_capacity INTEGER,
  outdoor_capacity INTEGER,
  catering_available BOOLEAN DEFAULT false,
  decoration_service BOOLEAN DEFAULT false,
  sound_system BOOLEAN DEFAULT false,
  lighting_system BOOLEAN DEFAULT false,
  stage_available BOOLEAN DEFAULT false,
  dj_service BOOLEAN DEFAULT false,
  photography_service BOOLEAN DEFAULT false,
  security_service BOOLEAN DEFAULT false,
  cleaning_service BOOLEAN DEFAULT false,
  event_types TEXT[],
  booking_advance_days INTEGER DEFAULT 7,
  cancellation_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shops table for shop/store specific fields
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  shop_type TEXT,
  floor_level INTEGER,
  frontage_width DECIMAL(8,2),
  ceiling_height DECIMAL(8,2),
  loading_bay BOOLEAN DEFAULT false,
  storage_space BOOLEAN DEFAULT false,
  display_windows INTEGER DEFAULT 0,
  foot_traffic TEXT CHECK (foot_traffic IN ('low', 'medium', 'high')),
  business_license_required BOOLEAN DEFAULT false,
  operating_hours TEXT,
  lease_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_favorites table
CREATE TABLE property_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Create property_views table for analytics
CREATE TABLE property_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_property_favorites_user_id ON property_favorites(user_id);
CREATE INDEX idx_property_views_property_id ON property_views(property_id);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all active properties" ON properties
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for related tables
CREATE POLICY "Users can manage their property amenities" ON property_amenities
  FOR ALL USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_amenities.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can view all property images" ON property_images
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their property images" ON property_images
  FOR ALL USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage their services" ON services
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all services" ON services
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites" ON property_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view property views" ON property_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert property views" ON property_views
  FOR INSERT WITH CHECK (true);