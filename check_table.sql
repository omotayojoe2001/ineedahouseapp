-- Check if event_centers table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'event_centers' 
ORDER BY ordinal_position;