-- Add comprehensive property fields based on detailed listing requirements
ALTER TABLE properties ADD COLUMN IF NOT EXISTS street_address TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS landmarks TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_level INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_units_in_building INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS guest_toilet INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS dining_area BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS kitchen_features TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS storage_space BOOLEAN DEFAULT false;

-- Utilities & Infrastructure
ALTER TABLE properties ADD COLUMN IF NOT EXISTS public_power BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS dedicated_transformer BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS backup_generator BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS borehole BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS treated_water BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fiber_ready BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS waste_management TEXT;

-- Security Features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gated_compound BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS security_personnel BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cctv_surveillance BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS access_control BOOLEAN DEFAULT false;

-- Parking Details
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking_spaces INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS visitor_parking BOOLEAN DEFAULT false;

-- Finishing & Condition
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pop_ceiling BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tiled_floors BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS modern_fittings BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS freshly_painted BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_condition TEXT CHECK (property_condition IN ('new', 'excellent', 'good', 'fair', 'needs_renovation'));

-- Legal Documentation
ALTER TABLE properties ADD COLUMN IF NOT EXISTS certificate_of_occupancy BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS deed_of_assignment BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS approved_building_plan BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS survey_plan BOOLEAN DEFAULT false;

-- Additional Rental Details
ALTER TABLE properties ADD COLUMN IF NOT EXISTS annual_rent DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS annual_service_charge DECIMAL(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agency_fee_percentage DECIMAL(5,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS legal_fee_percentage DECIMAL(5,2);

-- Property Specifications
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_rooms INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_age INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_amenities TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS transportation_access TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lease_terms TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pet_policy TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS utility_bills_included BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_building_type ON properties(building_type);
CREATE INDEX IF NOT EXISTS idx_properties_floor_level ON properties(floor_level);
CREATE INDEX IF NOT EXISTS idx_properties_property_condition ON properties(property_condition);
CREATE INDEX IF NOT EXISTS idx_properties_gated_compound ON properties(gated_compound);
CREATE INDEX IF NOT EXISTS idx_properties_parking_spaces ON properties(parking_spaces);