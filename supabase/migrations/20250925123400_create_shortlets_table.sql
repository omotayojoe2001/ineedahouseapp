-- Create dedicated shortlets table for shortlet properties
CREATE TABLE IF NOT EXISTS shortlets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT, -- apartment, house, studio
  property_sub_type TEXT, -- 1BR apartment, duplex, etc
  
  -- Location
  location TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Basic details
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,
  area_sqm DECIMAL(10,2),
  
  -- Pricing
  daily_rate DECIMAL(15,2),
  weekly_rate DECIMAL(15,2),
  monthly_rate DECIMAL(15,2),
  cleaning_fee DECIMAL(15,2) DEFAULT 0,
  security_deposit DECIMAL(15,2) DEFAULT 0,
  
  -- Booking rules
  minimum_stay INTEGER DEFAULT 1,
  maximum_stay INTEGER,
  check_in_time TEXT,
  check_out_time TEXT,
  instant_booking BOOLEAN DEFAULT FALSE,
  
  -- Policies
  house_rules TEXT,
  cancellation_policy TEXT,
  nearby_attractions TEXT,
  
  -- Amenities (shortlet-specific)
  wifi BOOLEAN DEFAULT FALSE,
  air_conditioning BOOLEAN DEFAULT FALSE,
  kitchen BOOLEAN DEFAULT FALSE,
  cable_tv BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  swimming_pool BOOLEAN DEFAULT FALSE,
  gym BOOLEAN DEFAULT FALSE,
  security_24_7 BOOLEAN DEFAULT FALSE,
  backup_generator BOOLEAN DEFAULT FALSE,
  laundry_service BOOLEAN DEFAULT FALSE,
  hot_water BOOLEAN DEFAULT FALSE,
  
  -- Media
  images TEXT[], -- Array of image URLs
  video_url TEXT,
  virtual_tour_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shortlets_user_id ON shortlets(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlets_location ON shortlets(location);
CREATE INDEX IF NOT EXISTS idx_shortlets_daily_rate ON shortlets(daily_rate);
CREATE INDEX IF NOT EXISTS idx_shortlets_status ON shortlets(status);
CREATE INDEX IF NOT EXISTS idx_shortlets_created_at ON shortlets(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE shortlets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shortlets' AND policyname = 'Users can view all active shortlets') THEN
    CREATE POLICY "Users can view all active shortlets" ON shortlets
      FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shortlets' AND policyname = 'Users can insert their own shortlets') THEN
    CREATE POLICY "Users can insert their own shortlets" ON shortlets
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shortlets' AND policyname = 'Users can update their own shortlets') THEN
    CREATE POLICY "Users can update their own shortlets" ON shortlets
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shortlets' AND policyname = 'Users can delete their own shortlets') THEN
    CREATE POLICY "Users can delete their own shortlets" ON shortlets
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create shortlet_favorites table
CREATE TABLE IF NOT EXISTS shortlet_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shortlet_id UUID REFERENCES shortlets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shortlet_id)
);

-- Enable RLS for favorites
ALTER TABLE shortlet_favorites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shortlet_favorites' AND policyname = 'Users can manage their shortlet favorites') THEN
    CREATE POLICY "Users can manage their shortlet favorites" ON shortlet_favorites
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;