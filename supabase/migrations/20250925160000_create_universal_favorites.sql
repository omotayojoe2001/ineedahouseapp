-- Drop old property_favorites table
DROP TABLE IF EXISTS property_favorites CASCADE;

-- Create universal favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('property', 'sale_property', 'shortlet', 'shop', 'event_center', 'service')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id, listing_type)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id, listing_type);
