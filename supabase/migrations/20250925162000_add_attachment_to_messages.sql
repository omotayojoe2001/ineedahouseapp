-- Add attachment column to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment TEXT;
