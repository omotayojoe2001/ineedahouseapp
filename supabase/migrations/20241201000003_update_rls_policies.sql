-- Update RLS policies to allow public read access for active properties
DROP POLICY IF EXISTS "Users can view all active properties" ON properties;
DROP POLICY IF EXISTS "Users can view all property images" ON property_images;
DROP POLICY IF EXISTS "Users can view all services" ON services;

-- Create new policies that allow public read access
CREATE POLICY "Public can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view property images" ON property_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view property amenities" ON property_amenities
  FOR SELECT USING (true);

CREATE POLICY "Public can view land listings" ON land_listings
  FOR SELECT USING (true);

CREATE POLICY "Public can view event centers" ON event_centers
  FOR SELECT USING (true);

CREATE POLICY "Public can view shops" ON shops
  FOR SELECT USING (true);

-- Keep existing policies for authenticated users to manage their own data
CREATE POLICY "Authenticated users can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = user_id);

-- Add function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET views = views + 1 
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;