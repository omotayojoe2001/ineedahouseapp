-- Fix conversations table to reference profiles properly
ALTER TABLE conversations 
DROP CONSTRAINT IF EXISTS conversations_participant_1_fkey,
DROP CONSTRAINT IF EXISTS conversations_participant_2_fkey;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_participant_1_fkey 
FOREIGN KEY (participant_1) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_participant_2_fkey 
FOREIGN KEY (participant_2) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix messages table to reference profiles properly  
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Drop and recreate function and trigger
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;
DROP FUNCTION IF EXISTS update_conversation_timestamp();

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at, updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when new message is sent
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();