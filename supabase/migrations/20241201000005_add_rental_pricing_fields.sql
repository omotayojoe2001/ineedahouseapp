-- Add rental pricing fields to properties table
ALTER TABLE properties ADD COLUMN rent_type TEXT CHECK (rent_type IN ('daily', 'weekly', 'monthly', 'annual'));
ALTER TABLE properties ADD COLUMN security_deposit DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN service_charge DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN agreement_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN commission_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN legal_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN caution_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN agency_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN inspection_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN other_fees JSONB DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN total_upfront_cost DECIMAL(15,2) DEFAULT 0;

-- Update existing rent properties with default rent_type
UPDATE properties SET rent_type = 'monthly' WHERE category = 'rent';
UPDATE properties SET rent_type = 'daily' WHERE category = 'shortlet';