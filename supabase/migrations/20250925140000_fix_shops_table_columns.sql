-- Drop and recreate shops table with correct structure
DROP TABLE IF EXISTS shops CASCADE;

CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  shop_type TEXT,
  shop_sub_type TEXT,
  location TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  floor_area_sqft DECIMAL(10,2),
  frontage_ft DECIMAL(8,2),
  floor_level TEXT,
  suitable_business_types TEXT[],
  target_customers TEXT,
  foot_traffic_level TEXT,
  operating_hours TEXT,
  monthly_rent DECIMAL(15,2),
  service_charge DECIMAL(15,2) DEFAULT 0,
  security_deposit DECIMAL(15,2) DEFAULT 0,
  customer_parking BOOLEAN DEFAULT FALSE,
  security_24_7 BOOLEAN DEFAULT FALSE,
  power_supply BOOLEAN DEFAULT FALSE,
  water_supply BOOLEAN DEFAULT FALSE,
  loading_bay BOOLEAN DEFAULT FALSE,
  storage_room BOOLEAN DEFAULT FALSE,
  display_windows BOOLEAN DEFAULT FALSE,
  signage_space BOOLEAN DEFAULT FALSE,
  customer_restroom BOOLEAN DEFAULT FALSE,
  air_conditioning BOOLEAN DEFAULT FALSE,
  neighboring_businesses TEXT,
  public_transport_access TEXT,
  market_days TEXT,
  competition_analysis TEXT,
  images TEXT[],
  floor_plan_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own shops" ON shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all shops" ON shops
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own shops" ON shops
  FOR UPDATE USING (auth.uid() = user_id);