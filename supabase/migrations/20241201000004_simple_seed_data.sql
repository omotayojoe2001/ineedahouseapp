-- Temporarily disable foreign key constraint for seed data
ALTER TABLE properties ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE services ALTER COLUMN user_id DROP NOT NULL;

-- Insert rental properties
INSERT INTO properties (
  id, user_id, title, description, category, property_type, price, duration, location,
  bedrooms, bathrooms, area_sqm, furnished, parking, security, generator, water_supply, internet,
  contact_phone, contact_email, featured, verified, rating, rating_count, status
) VALUES 
('11111111-1111-1111-1111-111111111111', NULL, 'Room in Lekki', 'Beautiful self-contained room in a secure estate with modern amenities.', 'rent', 'apartment', 150000, '/ month', 'Lekki, Lagos', 1, 1, 45.5, true, true, true, true, true, true, '+234 801 234 5678', 'owner@example.com', false, true, 4.96, 124, 'active'),
('22222222-2222-2222-2222-222222222222', NULL, 'Room in Victoria Island', 'Premium studio apartment in prestigious Victoria Island.', 'rent', 'apartment', 200000, '/ month', 'Victoria Island, Lagos', 1, 1, 52.0, true, true, true, true, true, true, '+234 802 345 6789', 'vi.owner@example.com', true, true, 4.92, 89, 'active'),
('33333333-3333-3333-3333-333333333333', NULL, 'Apartment in Ikeja', 'Spacious 2-bedroom apartment near airport.', 'rent', 'apartment', 180000, '/ month', 'Ikeja, Lagos', 2, 2, 85.0, false, true, true, true, true, true, '+234 803 456 7890', 'ikeja.owner@example.com', false, true, 4.88, 67, 'active'),
('44444444-4444-4444-4444-444444444444', NULL, 'Studio in Yaba', 'Modern studio in tech hub of Lagos.', 'rent', 'apartment', 120000, '/ month', 'Yaba, Lagos', 1, 1, 35.0, true, false, true, false, true, true, '+234 804 567 8901', 'yaba.owner@example.com', false, true, 4.85, 45, 'active'),
('55555555-5555-5555-5555-555555555555', NULL, 'Villa in Maitama', 'Luxury 4-bedroom villa in exclusive Maitama district.', 'rent', 'house', 350000, '/ month', 'Maitama, Abuja', 4, 3, 280.0, true, true, true, true, true, true, '+234 805 678 9012', 'maitama.owner@example.com', true, true, 4.94, 156, 'active'),
('66666666-6666-6666-6666-666666666666', NULL, 'Apartment in Garki', 'Well-appointed 3-bedroom apartment in Garki.', 'rent', 'apartment', 180000, '/ month', 'Garki, Abuja', 3, 2, 120.0, false, true, true, true, true, true, '+234 806 789 0123', 'garki.owner@example.com', false, true, 4.87, 78, 'active'),
('77777777-7777-7777-7777-777777777777', NULL, 'House in Wuse', 'Elegant 3-bedroom terrace house in Wuse Zone 4.', 'rent', 'house', 250000, '/ month', 'Wuse, Abuja', 3, 3, 150.0, false, true, true, true, true, true, '+234 807 890 1234', 'wuse.owner@example.com', true, true, 4.91, 92, 'active'),
('88888888-8888-8888-8888-888888888888', NULL, 'Duplex in Asokoro', 'Magnificent 5-bedroom duplex in prestigious Asokoro.', 'rent', 'house', 450000, '/ month', 'Asokoro, Abuja', 5, 4, 350.0, true, true, true, true, true, true, '+234 808 901 2345', 'asokoro.owner@example.com', true, true, 4.98, 203, 'active'),
('99999999-9999-9999-9999-999999999999', NULL, '4BR Detached House', 'Newly built 4-bedroom detached house.', 'sale', 'house', 45000000, ' total', 'Ikoyi, Lagos', 4, 3, 320.0, false, true, true, true, true, false, '+234 809 012 3456', 'ikoyi.sales@example.com', true, true, 4.8, 34, 'active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Modern Duplex', 'Contemporary 4-bedroom duplex with smart home technology.', 'sale', 'house', 32000000, ' total', 'Jahi, Abuja', 4, 4, 280.0, false, true, true, true, true, true, '+234 810 123 4567', 'jahi.sales@example.com', false, true, 4.6, 28, 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'Prime Commercial Land', 'Strategic commercial land in Victoria Island business district.', 'land', 'commercial', 25000000, ' total', 'Victoria Island, Lagos', NULL, NULL, 1200.0, false, true, true, true, true, false, '+234 811 234 5678', 'vi.land@example.com', true, true, 4.5, 12, 'active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'Residential Plot', 'Well-located residential plot in Gwarinpa.', 'land', 'residential', 8500000, ' total', 'Gwarinpa, Abuja', NULL, NULL, 600.0, false, true, true, true, true, false, '+234 812 345 6789', 'gwarinpa.land@example.com', false, true, 4.3, 8, 'active'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'Luxury Penthouse Suite', 'Exquisite penthouse suite with panoramic city views.', 'shortlet', 'apartment', 50000, '/ night', 'Victoria Island, Lagos', 2, 2, 150.0, true, true, true, true, true, true, '+234 813 456 7890', 'penthouse@example.com', true, true, 4.9, 187, 'active'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'Modern Smart Home', 'Fully automated smart home with voice control.', 'shortlet', 'house', 35000, '/ night', 'Lekki Phase 1, Lagos', 3, 3, 200.0, true, true, true, true, true, true, '+234 814 567 8901', 'smarthome@example.com', true, true, 4.8, 156, 'active'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'Prime Retail Space', 'Strategic retail space in busy shopping complex.', 'shop', 'retail', 180000, '/ month', 'Ikeja, Lagos', NULL, NULL, 85.0, false, true, true, true, true, true, '+234 815 678 9012', 'retail@example.com', false, true, 4.2, 23, 'active'),
('10101010-1010-1010-1010-101010101010', NULL, 'Modern Office Space', 'Contemporary office space in Grade A building.', 'shop', 'office', 250000, '/ month', 'Wuse, Abuja', NULL, NULL, 120.0, false, true, true, true, true, true, '+234 816 789 0123', 'office@example.com', true, true, 4.7, 41, 'active'),
('20202020-2020-2020-2020-202020202020', NULL, 'Grand Ballroom', 'Elegant ballroom perfect for weddings and events.', 'event_center', 'ballroom', 150000, '/ day', 'Victoria Island, Lagos', NULL, NULL, 500.0, false, true, true, true, true, true, '+234 817 890 1234', 'ballroom@example.com', true, true, 4.8, 89, 'active'),
('30303030-3030-3030-3030-303030303030', NULL, 'Garden Event Center', 'Beautiful outdoor event center with landscaped gardens.', 'event_center', 'garden', 120000, '/ day', 'Garki, Abuja', NULL, NULL, 800.0, false, true, true, true, true, false, '+234 818 901 2345', 'garden@example.com', false, true, 4.6, 67, 'active');

-- Insert property images
INSERT INTO property_images (property_id, image_url, caption, is_primary, order_index) VALUES
('11111111-1111-1111-1111-111111111111', '/src/assets/property-1.jpg', 'Main living area', true, 0),
('22222222-2222-2222-2222-222222222222', '/src/assets/property-2.jpg', 'Studio apartment', true, 0),
('33333333-3333-3333-3333-333333333333', '/src/assets/property-3.jpg', 'Living room', true, 0),
('44444444-4444-4444-4444-444444444444', '/src/assets/property-4.jpg', 'Studio space', true, 0),
('55555555-5555-5555-5555-555555555555', '/src/assets/property-3.jpg', 'Villa exterior', true, 0),
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
  id, user_id, title, description, service_type, price, price_type, location,
  contact_phone, contact_email, rating, rating_count, status
) VALUES 
('40404040-4040-4040-4040-404040404040', NULL, 'Full House Moving Service', 'Professional moving service with experienced team.', 'relocation', 150000, 'per_service', 'Lagos & Abuja', '+234 819 012 3456', 'moving@example.com', 4.9, 234, 'active'),
('50505050-5050-5050-5050-505050505050', NULL, 'Car Delivery Nigeria-wide', 'Reliable car transportation service across Nigeria.', 'relocation', 75000, 'per_service', 'Nationwide', '+234 820 123 4567', 'cardelivery@example.com', 4.7, 189, 'active'),
('60606060-6060-6060-6060-606060606060', NULL, 'Professional Painting', 'Expert painting services for residential and commercial properties.', 'painting', 25000, 'per_item', 'Lagos, Abuja', '+234 821 234 5678', 'painting@example.com', 4.8, 156, 'active'),
('70707070-7070-7070-7070-707070707070', NULL, 'Furniture Assembly', 'Professional furniture assembly service for all brands.', 'furniture', 15000, 'per_item', 'Lagos, Abuja', '+234 822 345 6789', 'furniture@example.com', 4.5, 98, 'active');