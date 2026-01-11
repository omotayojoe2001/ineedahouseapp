-- Temporarily disable foreign key constraint for seed data
ALTER TABLE properties ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE services ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample properties for all categories
-- Using NULL for user_id in seed data

-- Insert rental properties in Lagos
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  bedrooms, bathrooms, area_sqm, furnished, parking, security, generator, water_supply, internet,
  gym, swimming_pool, garden, balcony, elevator, air_conditioning, contact_phone, contact_email,
  featured, verified, rating, rating_count, status
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'Room in Lekki',
  'Beautiful self-contained room in a secure estate. Fully furnished with modern amenities including 24/7 electricity, water supply, and high-speed internet. Located in the heart of Lekki with easy access to shopping malls, restaurants, and business districts.',
  'rent', 'apartment', 150000, '/ month', 'Lekki, Lagos', 'Block 15, Lekki Gardens Estate, Lekki Phase 1, Lagos',
  1, 1, 45.5, true, true, true, true, true, true,
  false, false, false, true, false, true, '+234 801 234 5678', 'owner@example.com',
  false, true, 4.96, 124, 'active'
),
(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'Room in Victoria Island',
  'Premium studio apartment in the prestigious Victoria Island. Features include marble floors, fitted kitchen, 24/7 security, backup generator, and stunning city views. Perfect for young professionals.',
  'rent', 'apartment', 200000, '/ month', 'Victoria Island, Lagos', '15 Ahmadu Bello Way, Victoria Island, Lagos',
  1, 1, 52.0, true, true, true, true, true, true,
  true, false, false, true, true, true, '+234 802 345 6789', 'vi.owner@example.com',
  true, true, 4.92, 89, 'active'
),
(
  '33333333-3333-3333-3333-333333333333',
  NULL,
  'Apartment in Ikeja',
  'Spacious 2-bedroom apartment in a well-maintained building. Features include fitted wardrobes, modern kitchen, ample parking space, and 24/7 security. Close to Murtala Muhammed Airport and major business centers.',
  'rent', 'apartment', 180000, '/ month', 'Ikeja, Lagos', '22 Allen Avenue, Ikeja, Lagos',
  2, 2, 85.0, false, true, true, true, true, true,
  false, false, true, false, false, true, '+234 803 456 7890', 'ikeja.owner@example.com',
  false, true, 4.88, 67, 'active'
),
(
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'Studio in Yaba',
  'Modern studio apartment perfect for students and young professionals. Located in the tech hub of Lagos with easy access to universities, tech companies, and entertainment centers. Fully furnished with high-speed internet.',
  'rent', 'apartment', 120000, '/ month', 'Yaba, Lagos', '8 Herbert Macaulay Street, Yaba, Lagos',
  1, 1, 35.0, true, false, true, false, true, true,
  false, false, false, true, false, true, '+234 804 567 8901', 'yaba.owner@example.com',
  false, true, 4.85, 45, 'active'
);

-- Insert rental properties in Abuja
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  bedrooms, bathrooms, area_sqm, furnished, parking, security, generator, water_supply, internet,
  gym, swimming_pool, garden, balcony, elevator, air_conditioning, contact_phone, contact_email,
  featured, verified, rating, rating_count, status
) VALUES 
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'Villa in Maitama',
  'Luxury 4-bedroom villa in the exclusive Maitama district. Features include a private swimming pool, landscaped garden, staff quarters, 24/7 security, and backup generator. Perfect for executives and diplomats.',
  'rent', 'house', 350000, '/ month', 'Maitama, Abuja', '12 Aguiyi Ironsi Street, Maitama, Abuja',
  4, 3, 280.0, true, true, true, true, true, true,
  false, true, true, true, false, true, '+234 805 678 9012', 'maitama.owner@example.com',
  true, true, 4.94, 156, 'active'
),
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'Apartment in Garki',
  'Well-appointed 3-bedroom apartment in Garki Area 11. Features modern fittings, ample parking, 24/7 security, and easy access to government offices and shopping centers. Ideal for civil servants and business professionals.',
  'rent', 'apartment', 180000, '/ month', 'Garki, Abuja', 'Plot 45, Garki Area 11, Abuja',
  3, 2, 120.0, false, true, true, true, true, true,
  false, false, false, true, false, true, '+234 806 789 0123', 'garki.owner@example.com',
  false, true, 4.87, 78, 'active'
),
(
  '77777777-7777-7777-7777-777777777777',
  '00000000-0000-0000-0000-000000000000',
  'House in Wuse',
  'Elegant 3-bedroom terrace house in Wuse Zone 4. Features include a fitted kitchen, family lounge, guest toilet, parking for 2 cars, and 24/7 security. Close to shopping malls and business districts.',
  'rent', 'house', 250000, '/ month', 'Wuse, Abuja', '18 Adetokunbo Ademola Crescent, Wuse Zone 4, Abuja',
  3, 3, 150.0, false, true, true, true, true, true,
  false, false, true, false, false, true, '+234 807 890 1234', 'wuse.owner@example.com',
  true, true, 4.91, 92, 'active'
),
(
  '88888888-8888-8888-8888-888888888888',
  '00000000-0000-0000-0000-000000000000',
  'Duplex in Asokoro',
  'Magnificent 5-bedroom duplex in the prestigious Asokoro district. Features include a private garden, swimming pool, gym, staff quarters, 24/7 security, and panoramic city views. Perfect for high-net-worth individuals.',
  'rent', 'house', 450000, '/ month', 'Asokoro, Abuja', '25 Yakubu Gowon Crescent, Asokoro, Abuja',
  5, 4, 350.0, true, true, true, true, true, true,
  true, true, true, true, true, true, '+234 808 901 2345', 'asokoro.owner@example.com',
  true, true, 4.98, 203, 'active'
);

-- Insert properties for sale
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  bedrooms, bathrooms, area_sqm, furnished, parking, security, generator, water_supply, internet,
  gym, swimming_pool, garden, balcony, elevator, air_conditioning, contact_phone, contact_email,
  featured, verified, rating, rating_count, status
) VALUES 
(
  '99999999-9999-9999-9999-999999999999',
  '00000000-0000-0000-0000-000000000000',
  '4BR Detached House',
  'Newly built 4-bedroom detached house with modern architectural design. Features include a spacious living area, fitted kitchen, family lounge, study room, 2-car garage, and beautiful landscaping. Located in a serene neighborhood with good road network.',
  'sale', 'house', 45000000, ' total', 'Ikoyi, Lagos', '34 Bourdillon Road, Ikoyi, Lagos',
  4, 3, 320.0, false, true, true, true, true, false,
  false, false, true, true, false, true, '+234 809 012 3456', 'ikoyi.sales@example.com',
  true, true, 4.8, 34, 'active'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'Modern Duplex',
  'Contemporary 4-bedroom duplex with state-of-the-art facilities. Features include smart home technology, solar panels, rainwater harvesting system, and eco-friendly design. Perfect for environmentally conscious buyers.',
  'sale', 'house', 32000000, ' total', 'Jahi, Abuja', 'Plot 123, Jahi District, Abuja',
  4, 4, 280.0, false, true, true, true, true, true,
  false, false, true, true, false, true, '+234 810 123 4567', 'jahi.sales@example.com',
  false, true, 4.6, 28, 'active'
);

-- Insert land listings
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  area_sqm, contact_phone, contact_email, featured, verified, rating, rating_count, status
) VALUES 
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '00000000-0000-0000-0000-000000000000',
  'Prime Commercial Land',
  'Strategic commercial land located in the heart of Victoria Island business district. Perfect for office complex, shopping mall, or mixed-use development. Comes with C of O and building approval. Excellent investment opportunity.',
  'land', 'commercial', 25000000, ' total', 'Victoria Island, Lagos', 'Plot 456, Tiamiyu Savage Street, Victoria Island, Lagos',
  1200.0, '+234 811 234 5678', 'vi.land@example.com', true, true, 4.5, 12, 'active'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '00000000-0000-0000-0000-000000000000',
  'Residential Plot',
  'Well-located residential plot in a fast-developing area of Gwarinpa. Perfect for building your dream home. The area has good road network, electricity, and water supply. All necessary documents available.',
  'land', 'residential', 8500000, ' total', 'Gwarinpa, Abuja', 'Plot 789, Gwarinpa Extension, Abuja',
  600.0, '+234 812 345 6789', 'gwarinpa.land@example.com', false, true, 4.3, 8, 'active'
);

-- Insert shortlet properties
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  bedrooms, bathrooms, area_sqm, furnished, parking, security, generator, water_supply, internet,
  gym, swimming_pool, garden, balcony, elevator, air_conditioning, minimum_stay, maximum_stay,
  contact_phone, contact_email, featured, verified, rating, rating_count, status
) VALUES 
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '00000000-0000-0000-0000-000000000000',
  'Luxury Penthouse Suite',
  'Exquisite penthouse suite with panoramic city views. Features include a private terrace, jacuzzi, fully equipped kitchen, high-speed internet, and 24/7 concierge service. Perfect for business travelers and luxury seekers.',
  'shortlet', 'apartment', 50000, '/ night', 'Victoria Island, Lagos', 'Eko Pearl Towers, Victoria Island, Lagos',
  2, 2, 150.0, true, true, true, true, true, true,
  true, false, false, true, true, true, 1, 30,
  '+234 813 456 7890', 'penthouse@example.com', true, true, 4.9, 187, 'active'
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '00000000-0000-0000-0000-000000000000',
  'Modern Smart Home',
  'Fully automated smart home with voice control, smart lighting, climate control, and security systems. Features include a home theater, wine cellar, and rooftop garden. Ideal for tech enthusiasts and luxury travelers.',
  'shortlet', 'house', 35000, '/ night', 'Lekki Phase 1, Lagos', '12 Admiralty Way, Lekki Phase 1, Lagos',
  3, 3, 200.0, true, true, true, true, true, true,
  false, true, true, true, false, true, 2, 14,
  '+234 814 567 8901', 'smarthome@example.com', true, true, 4.8, 156, 'active'
);

-- Insert shop listings
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  area_sqm, parking, security, generator, water_supply, internet, elevator, air_conditioning,
  contact_phone, contact_email, featured, verified, rating, rating_count, status
) VALUES 
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '00000000-0000-0000-0000-000000000000',
  'Prime Retail Space',
  'Strategic retail space in a busy shopping complex. Features include large display windows, storage area, customer parking, 24/7 security, and high foot traffic. Perfect for fashion, electronics, or general merchandise.',
  'shop', 'retail', 180000, '/ month', 'Ikeja, Lagos', 'Shop 45, Computer Village, Ikeja, Lagos',
  85.0, true, true, true, true, true, false, true,
  '+234 815 678 9012', 'retail@example.com', false, true, 4.2, 23, 'active'
),
(
  '10101010-1010-1010-1010-101010101010',
  '00000000-0000-0000-0000-000000000000',
  'Modern Office Space',
  'Contemporary office space in a Grade A building. Features include open plan layout, meeting rooms, reception area, parking spaces, 24/7 security, backup generator, and high-speed internet connectivity.',
  'shop', 'office', 250000, '/ month', 'Wuse, Abuja', 'Floor 8, Silverbird Galleria, Wuse Zone 1, Abuja',
  120.0, true, true, true, true, true, true, true,
  '+234 816 789 0123', 'office@example.com', true, true, 4.7, 41, 'active'
);

-- Insert event center listings
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location, address,
  area_sqm, parking, security, generator, water_supply, internet, air_conditioning,
  contact_phone, contact_email, featured, verified, rating, rating_count, status
) VALUES 
(
  '20202020-2020-2020-2020-202020202020',
  '00000000-0000-0000-0000-000000000000',
  'Grand Ballroom',
  'Elegant ballroom perfect for weddings, corporate events, and social gatherings. Features include crystal chandeliers, marble floors, stage area, bridal suite, ample parking, catering kitchen, and professional sound system.',
  'event_center', 'ballroom', 150000, '/ day', 'Victoria Island, Lagos', '25 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
  500.0, true, true, true, true, true, true,
  '+234 817 890 1234', 'ballroom@example.com', true, true, 4.8, 89, 'active'
),
(
  '30303030-3030-3030-3030-303030303030',
  '00000000-0000-0000-0000-000000000000',
  'Garden Event Center',
  'Beautiful outdoor event center with landscaped gardens and indoor backup hall. Perfect for weddings, birthday parties, and corporate retreats. Features include gazebo, fountain, catering facilities, and ample parking.',
  'event_center', 'garden', 120000, '/ day', 'Garki, Abuja', '15 Tafawa Balewa Way, Garki, Abuja',
  800.0, true, true, true, true, false, false,
  '+234 818 901 2345', 'garden@example.com', false, true, 4.6, 67, 'active'
);

-- Insert property images
INSERT INTO property_images (property_id, image_url, caption, is_primary, order_index) VALUES
-- Room in Lekki images
('11111111-1111-1111-1111-111111111111', '/src/assets/property-1.jpg', 'Main living area', true, 0),
('11111111-1111-1111-1111-111111111111', '/src/assets/property-2.jpg', 'Kitchen area', false, 1),
('11111111-1111-1111-1111-111111111111', '/src/assets/property-3.jpg', 'Bathroom', false, 2),

-- Room in Victoria Island images
('22222222-2222-2222-2222-222222222222', '/src/assets/property-2.jpg', 'Studio apartment', true, 0),
('22222222-2222-2222-2222-222222222222', '/src/assets/property-1.jpg', 'City view', false, 1),
('22222222-2222-2222-2222-222222222222', '/src/assets/property-4.jpg', 'Kitchen', false, 2),

-- Apartment in Ikeja images
('33333333-3333-3333-3333-333333333333', '/src/assets/property-3.jpg', 'Living room', true, 0),
('33333333-3333-3333-3333-333333333333', '/src/assets/property-1.jpg', 'Master bedroom', false, 1),
('33333333-3333-3333-3333-333333333333', '/src/assets/property-2.jpg', 'Kitchen', false, 2),

-- Studio in Yaba images
('44444444-4444-4444-4444-444444444444', '/src/assets/property-4.jpg', 'Studio space', true, 0),
('44444444-4444-4444-4444-444444444444', '/src/assets/property-3.jpg', 'Work area', false, 1),

-- Villa in Maitama images
('55555555-5555-5555-5555-555555555555', '/src/assets/property-3.jpg', 'Villa exterior', true, 0),
('55555555-5555-5555-5555-555555555555', '/src/assets/property-1.jpg', 'Swimming pool', false, 1),
('55555555-5555-5555-5555-555555555555', '/src/assets/property-2.jpg', 'Master bedroom', false, 2),
('55555555-5555-5555-5555-555555555555', '/src/assets/property-4.jpg', 'Garden view', false, 3),

-- Continue for other properties...
('66666666-6666-6666-6666-666666666666', '/src/assets/property-4.jpg', 'Apartment exterior', true, 0),
('77777777-7777-7777-7777-777777777777', '/src/assets/property-1.jpg', 'House front', true, 0),
('88888888-8888-8888-8888-888888888888', '/src/assets/property-2.jpg', 'Duplex exterior', true, 0),
('99999999-9999-9999-9999-999999999999', '/src/assets/property-3.jpg', 'House exterior', true, 0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/src/assets/property-4.jpg', 'Modern duplex', true, 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/src/assets/property-1.jpg', 'Land plot', true, 0),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '/src/assets/property-2.jpg', 'Residential plot', true, 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '/src/assets/property-1.jpg', 'Penthouse view', true, 0),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '/src/assets/property-2.jpg', 'Smart home', true, 0),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '/src/assets/property-3.jpg', 'Retail space', true, 0),
('10101010-1010-1010-1010-101010101010', '/src/assets/property-4.jpg', 'Office space', true, 0),
('20202020-2020-2020-2020-202020202020', '/src/assets/property-1.jpg', 'Ballroom', true, 0),
('30303030-3030-3030-3030-303030303030', '/src/assets/property-2.jpg', 'Garden center', true, 0);

-- Insert services
INSERT INTO services (
  id, user_id, title, description, service_type, price, price_type, location, service_areas,
  availability, contact_phone, contact_email, rating, rating_count, status
) VALUES 
(
  '40404040-4040-4040-4040-404040404040',
  '00000000-0000-0000-0000-000000000000',
  'Full House Moving Service',
  'Professional moving service with experienced team and modern equipment. We handle packing, loading, transportation, and unpacking. Fully insured service with careful handling of fragile items. Available nationwide.',
  'relocation', 150000, 'per_service', 'Lagos & Abuja', ARRAY['Lagos', 'Abuja', 'Port Harcourt', 'Kano'],
  'Monday to Saturday, 8AM - 6PM', '+234 819 012 3456', 'moving@example.com', 4.9, 234, 'active'
),
(
  '50505050-5050-5050-5050-505050505050',
  '00000000-0000-0000-0000-000000000000',
  'Car Delivery Nigeria-wide',
  'Reliable car transportation service across Nigeria. We transport all vehicle types with full insurance coverage. Door-to-door service with real-time tracking. Professional drivers and secure loading.',
  'relocation', 75000, 'per_service', 'Nationwide', ARRAY['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Kaduna'],
  '24/7 Service Available', '+234 820 123 4567', 'cardelivery@example.com', 4.7, 189, 'active'
),
(
  '60606060-6060-6060-6060-606060606060',
  '00000000-0000-0000-0000-000000000000',
  'Professional Painting',
  'Expert painting services for residential and commercial properties. We use high-quality paints and materials. Services include interior painting, exterior painting, texture work, and color consultation.',
  'painting', 25000, 'per_item', 'Lagos, Abuja', ARRAY['Lagos', 'Abuja'],
  'Monday to Friday, 8AM - 5PM', '+234 821 234 5678', 'painting@example.com', 4.8, 156, 'active'
),
(
  '70707070-7070-7070-7070-707070707070',
  '00000000-0000-0000-0000-000000000000',
  'Furniture Assembly',
  'Professional furniture assembly service for all brands and types. We assemble beds, wardrobes, dining sets, office furniture, and more. Tools and expertise provided. Quick and efficient service.',
  'furniture', 15000, 'per_item', 'Lagos, Abuja', ARRAY['Lagos', 'Abuja'],
  'Monday to Saturday, 9AM - 6PM', '+234 822 345 6789', 'furniture@example.com', 4.5, 98, 'active'
),
(
  '80808080-8080-8080-8080-808080808080',
  '00000000-0000-0000-0000-000000000000',
  'Plumbing Services',
  'Complete plumbing solutions including installation, repair, and maintenance. We handle pipe fitting, toilet installation, water heater repair, and emergency plumbing issues. Licensed and insured.',
  'maintenance', 20000, 'per_service', 'Lagos, Abuja', ARRAY['Lagos', 'Abuja'],
  '24/7 Emergency Service', '+234 823 456 7890', 'plumbing@example.com', 4.6, 145, 'active'
),
(
  '90909090-9090-9090-9090-909090909090',
  '00000000-0000-0000-0000-000000000000',
  'Electrical Services',
  'Professional electrical services including wiring, installation, and repairs. We handle residential and commercial electrical work. Emergency callouts available. All work guaranteed.',
  'maintenance', 18000, 'per_service', 'Lagos, Abuja', ARRAY['Lagos', 'Abuja'],
  'Monday to Saturday, 8AM - 6PM', '+234 824 567 8901', 'electrical@example.com', 4.7, 123, 'active'
);

-- Insert land-specific data
INSERT INTO land_listings (
  property_id, land_type, land_use, title_document, survey_plan, deed_of_assignment,
  certificate_of_occupancy, building_approval, soil_test, topography, access_road,
  electricity_available, water_source, drainage
) VALUES 
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'commercial', 'Mixed-use development', 'Certificate of Occupancy', true, true,
  true, true, true, 'Flat terrain', true, true, 'Borehole and mains', true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'residential', 'Residential building', 'Deed of Assignment', true, true,
  false, false, false, 'Gently sloping', true, true, 'Borehole', true
);

-- Insert event center specific data
INSERT INTO event_centers (
  property_id, capacity, indoor_capacity, outdoor_capacity, catering_available,
  decoration_service, sound_system, lighting_system, stage_available, dj_service,
  photography_service, security_service, cleaning_service, event_types,
  booking_advance_days, cancellation_policy
) VALUES 
(
  '20202020-2020-2020-2020-202020202020',
  300, 250, 50, true, true, true, true, true, true,
  true, true, true, ARRAY['Wedding', 'Corporate Event', 'Birthday Party', 'Conference'],
  14, 'Cancellation allowed up to 7 days before event with 50% refund'
),
(
  '30303030-3030-3030-3030-303030303030',
  500, 200, 300, true, true, true, false, false, false,
  false, true, true, ARRAY['Wedding', 'Birthday Party', 'Corporate Retreat', 'Family Reunion'],
  7, 'Cancellation allowed up to 3 days before event with 25% refund'
);

-- Insert shop specific data
INSERT INTO shops (
  property_id, shop_type, floor_level, frontage_width, ceiling_height,
  loading_bay, storage_space, display_windows, foot_traffic,
  business_license_required, operating_hours, lease_terms
) VALUES 
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Electronics Store', 0, 8.5, 3.5, false, true, 3, 'high',
  true, '9AM - 9PM Daily', 'Minimum 2 years lease, renewable'
),
(
  '10101010-1010-1010-1010-101010101010',
  'Corporate Office', 8, 12.0, 3.0, false, false, 0, 'medium',
  true, '24/7 Access', 'Minimum 3 years lease with option to renew'
);

-- Insert property amenities
INSERT INTO property_amenities (property_id, amenity_name, amenity_value) VALUES
-- Villa in Maitama amenities
('55555555-5555-5555-5555-555555555555', 'Swimming Pool', 'Private pool with heating'),
('55555555-5555-5555-5555-555555555555', 'Garden', 'Landscaped garden with fountain'),
('55555555-5555-5555-5555-555555555555', 'Staff Quarters', '2-bedroom staff quarters'),
('55555555-5555-5555-5555-555555555555', 'CCTV', '24/7 surveillance system'),

-- Duplex in Asokoro amenities
('88888888-8888-8888-8888-888888888888', 'Home Theater', 'Fully equipped cinema room'),
('88888888-8888-8888-8888-888888888888', 'Wine Cellar', 'Climate-controlled wine storage'),
('88888888-8888-8888-8888-888888888888', 'Rooftop Terrace', 'Panoramic city views'),
('88888888-8888-8888-8888-888888888888', 'Smart Home', 'Automated lighting and climate control'),

-- Penthouse amenities
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Jacuzzi', 'Private rooftop jacuzzi'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Concierge', '24/7 concierge service'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Valet Parking', 'Complimentary valet service'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'City Views', '360-degree panoramic views');