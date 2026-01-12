-- Add tenant preference fields to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS allows_pets TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_preference TEXT;