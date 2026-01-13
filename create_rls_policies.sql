-- RLS Policies for all tables

-- Properties table policies
CREATE POLICY "Users can view properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Shortlets table policies
CREATE POLICY "Users can view shortlets" ON shortlets FOR SELECT USING (true);
CREATE POLICY "Users can update own shortlets" ON shortlets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shortlets" ON shortlets FOR DELETE USING (auth.uid() = user_id);

-- Sale properties table policies
CREATE POLICY "Users can view sale properties" ON sale_properties FOR SELECT USING (true);
CREATE POLICY "Users can update own sale properties" ON sale_properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sale properties" ON sale_properties FOR DELETE USING (auth.uid() = user_id);

-- Shops table policies
CREATE POLICY "Users can view shops" ON shops FOR SELECT USING (true);
CREATE POLICY "Users can update own shops" ON shops FOR UPDATE USING (auth.uid() = user_id);
-- DELETE policy for shops already exists

-- Services table policies
CREATE POLICY "Users can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Users can update own services" ON services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own services" ON services FOR DELETE USING (auth.uid() = user_id);

-- Event centers table policies
CREATE POLICY "Users can view event centers" ON event_centers FOR SELECT USING (true);
CREATE POLICY "Users can update own event centers" ON event_centers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own event centers" ON event_centers FOR DELETE USING (auth.uid() = user_id);