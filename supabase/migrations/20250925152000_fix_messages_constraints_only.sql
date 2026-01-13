-- Fix conversations table foreign keys to reference profiles
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'conversations_participant_1_fkey' 
               AND table_name = 'conversations') THEN
        ALTER TABLE conversations DROP CONSTRAINT conversations_participant_1_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'conversations_participant_2_fkey' 
               AND table_name = 'conversations') THEN
        ALTER TABLE conversations DROP CONSTRAINT conversations_participant_2_fkey;
    END IF;
    
    -- Add new constraints referencing profiles
    ALTER TABLE conversations 
    ADD CONSTRAINT conversations_participant_1_fkey 
    FOREIGN KEY (participant_1) REFERENCES profiles(id) ON DELETE CASCADE;
    
    ALTER TABLE conversations 
    ADD CONSTRAINT conversations_participant_2_fkey 
    FOREIGN KEY (participant_2) REFERENCES profiles(id) ON DELETE CASCADE;
END $$;

-- Fix messages table foreign key to reference profiles
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_sender_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE messages DROP CONSTRAINT messages_sender_id_fkey;
    END IF;
    
    -- Add new constraint referencing profiles
    ALTER TABLE messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
END $$;