-- Ensure supabase_auth_admin can insert into profiles during signup trigger
GRANT SELECT, INSERT, UPDATE ON public.profiles TO supabase_auth_admin;

-- Allow the internal auth admin role to insert profiles rows (bypassing user_id check)
DROP POLICY IF EXISTS "System can create profiles on signup" ON public.profiles;
CREATE POLICY "System can create profiles on signup"
ON public.profiles
FOR INSERT
TO supabase_auth_admin
WITH CHECK (true);