-- Add shortlet-specific fields to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS weekly_rate DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_rate DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cleaning_fee DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS max_guests INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_in_time TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_out_time TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_attractions TEXT;