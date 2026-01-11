-- Create location tables for standardized location data

-- States table
CREATE TABLE IF NOT EXISTS states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities/LGAs table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, state_id)
);

-- Areas/Districts table
CREATE TABLE IF NOT EXISTS areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, city_id)
);

-- Streets table
CREATE TABLE IF NOT EXISTS streets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, area_id)
);

-- Landmarks table
CREATE TABLE IF NOT EXISTS landmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  landmark_type TEXT DEFAULT 'general', -- mall, school, hospital, bank, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, area_id)
);

-- Insert Nigerian states
INSERT INTO states (name, code) VALUES
('Abia', 'AB'),
('Adamawa', 'AD'),
('Akwa Ibom', 'AK'),
('Anambra', 'AN'),
('Bauchi', 'BA'),
('Bayelsa', 'BY'),
('Benue', 'BE'),
('Borno', 'BO'),
('Cross River', 'CR'),
('Delta', 'DE'),
('Ebonyi', 'EB'),
('Edo', 'ED'),
('Ekiti', 'EK'),
('Enugu', 'EN'),
('FCT', 'FC'),
('Gombe', 'GO'),
('Imo', 'IM'),
('Jigawa', 'JI'),
('Kaduna', 'KD'),
('Kano', 'KN'),
('Katsina', 'KT'),
('Kebbi', 'KE'),
('Kogi', 'KO'),
('Kwara', 'KW'),
('Lagos', 'LA'),
('Nasarawa', 'NA'),
('Niger', 'NI'),
('Ogun', 'OG'),
('Ondo', 'ON'),
('Osun', 'OS'),
('Oyo', 'OY'),
('Plateau', 'PL'),
('Rivers', 'RI'),
('Sokoto', 'SO'),
('Taraba', 'TA'),
('Yobe', 'YO'),
('Zamfara', 'ZA')
ON CONFLICT (name) DO NOTHING;

-- Insert major Lagos areas to start
INSERT INTO cities (name, state_id) 
SELECT 'Lagos Island', id FROM states WHERE name = 'Lagos'
UNION ALL
SELECT 'Lagos Mainland', id FROM states WHERE name = 'Lagos'
UNION ALL
SELECT 'Ikeja', id FROM states WHERE name = 'Lagos'
UNION ALL
SELECT 'Ikorodu', id FROM states WHERE name = 'Lagos'
UNION ALL
SELECT 'Epe', id FROM states WHERE name = 'Lagos'
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert popular Lagos areas
INSERT INTO areas (name, city_id)
SELECT 'Lekki Phase 1', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL
SELECT 'Victoria Island', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL
SELECT 'Ikoyi', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL
SELECT 'Yaba', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Mainland' AND s.name = 'Lagos'
UNION ALL
SELECT 'Surulere', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Mainland' AND s.name = 'Lagos'
UNION ALL
SELECT 'Ajah', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert popular landmarks
INSERT INTO landmarks (name, landmark_type, area_id)
SELECT 'The Palms Shopping Mall', 'mall', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
UNION ALL
SELECT 'Lekki Phase 1 Roundabout', 'roundabout', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
UNION ALL
SELECT 'National Theatre', 'landmark', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Ikoyi' AND s.name = 'Lagos'
ON CONFLICT (name, area_id) DO NOTHING;

-- Update properties table to use location IDs
ALTER TABLE properties ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES areas(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS street_id UUID REFERENCES streets(id);