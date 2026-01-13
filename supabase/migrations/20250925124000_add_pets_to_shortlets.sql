-- Add allow_pets field to shortlets table
ALTER TABLE shortlets ADD COLUMN IF NOT EXISTS allow_pets TEXT CHECK (allow_pets IN ('yes', 'no', 'small-pets'));