-- Comprehensive Nigerian Location Data Seeding
-- This populates the database with extensive location data like loan apps use

-- Clear existing data (optional)
-- DELETE FROM landmarks;
-- DELETE FROM streets;
-- DELETE FROM areas;
-- DELETE FROM cities;
-- DELETE FROM states;

-- Insert all Nigerian states with codes
INSERT INTO states (name, code) VALUES
('Abia', 'AB'),
('Adamawa', 'AD'),
('Akwa Ibom', 'AK'),
('Anambra', 'AN'),
('Bauchi', 'BA'),
('Bayelsa', 'BY'),
('Benue', 'BE'),
('Borno', 'BO'),
('Cross River', 'CR'),
('Delta', 'DE'),
('Ebonyi', 'EB'),
('Edo', 'ED'),
('Ekiti', 'EK'),
('Enugu', 'EN'),
('FCT', 'FC'),
('Gombe', 'GO'),
('Imo', 'IM'),
('Jigawa', 'JI'),
('Kaduna', 'KD'),
('Kano', 'KN'),
('Katsina', 'KT'),
('Kebbi', 'KE'),
('Kogi', 'KO'),
('Kwara', 'KW'),
('Lagos', 'LA'),
('Nasarawa', 'NA'),
('Niger', 'NI'),
('Ogun', 'OG'),
('Ondo', 'ON'),
('Osun', 'OS'),
('Oyo', 'OY'),
('Plateau', 'PL'),
('Rivers', 'RI'),
('Sokoto', 'SO'),
('Taraba', 'TA'),
('Yobe', 'YO'),
('Zamfara', 'ZA')
ON CONFLICT (name) DO NOTHING;

-- Insert Lagos LGAs (most comprehensive)
INSERT INTO cities (name, state_id) 
SELECT 'Agege', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ajeromi-Ifelodun', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Alimosho', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Amuwo-Odofin', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Apapa', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Badagry', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Epe', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Eti Osa', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ibeju-Lekki', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ifako-Ijaiye', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ikeja', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ikorodu', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Kosofe', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Lagos Island', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Lagos Mainland', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Mushin', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Ojo', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Oshodi-Isolo', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Shomolu', id FROM states WHERE name = 'Lagos'
UNION ALL SELECT 'Surulere', id FROM states WHERE name = 'Lagos'
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert FCT Area Councils
INSERT INTO cities (name, state_id)
SELECT 'Abaji', id FROM states WHERE name = 'FCT'
UNION ALL SELECT 'Bwari', id FROM states WHERE name = 'FCT'
UNION ALL SELECT 'Gwagwalada', id FROM states WHERE name = 'FCT'
UNION ALL SELECT 'Kuje', id FROM states WHERE name = 'FCT'
UNION ALL SELECT 'Kwali', id FROM states WHERE name = 'FCT'
UNION ALL SELECT 'Municipal Area Council', id FROM states WHERE name = 'FCT'
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert Rivers LGAs
INSERT INTO cities (name, state_id)
SELECT 'Port Harcourt', id FROM states WHERE name = 'Rivers'
UNION ALL SELECT 'Obio/Akpor', id FROM states WHERE name = 'Rivers'
UNION ALL SELECT 'Ikwerre', id FROM states WHERE name = 'Rivers'
UNION ALL SELECT 'Eleme', id FROM states WHERE name = 'Rivers'
UNION ALL SELECT 'Oyigbo', id FROM states WHERE name = 'Rivers'
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert popular Lagos areas
INSERT INTO areas (name, city_id)
-- Lagos Island areas
SELECT 'Victoria Island', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL SELECT 'Ikoyi', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL SELECT 'Marina', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
UNION ALL SELECT 'Broad Street', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Island' AND s.name = 'Lagos'
-- Eti Osa areas
UNION ALL SELECT 'Lekki Phase 1', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Eti Osa' AND s.name = 'Lagos'
UNION ALL SELECT 'Lekki Phase 2', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Eti Osa' AND s.name = 'Lagos'
UNION ALL SELECT 'Ajah', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Eti Osa' AND s.name = 'Lagos'
UNION ALL SELECT 'Sangotedo', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Eti Osa' AND s.name = 'Lagos'
-- Lagos Mainland areas
UNION ALL SELECT 'Yaba', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Mainland' AND s.name = 'Lagos'
UNION ALL SELECT 'Surulere', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Mainland' AND s.name = 'Lagos'
UNION ALL SELECT 'Ebute Metta', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Lagos Mainland' AND s.name = 'Lagos'
-- Ikeja areas
UNION ALL SELECT 'GRA Ikeja', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Allen Avenue', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Computer Village', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Alausa', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Oregun', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Ojodu', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Berger', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Omole Phase 1', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Omole Phase 2', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
UNION ALL SELECT 'Magodo', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikeja' AND s.name = 'Lagos'
-- Ikorodu areas
UNION ALL SELECT 'Ikorodu Town', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikorodu' AND s.name = 'Lagos'
UNION ALL SELECT 'Sagamu Road', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Ikorodu' AND s.name = 'Lagos'
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert Abuja areas
INSERT INTO areas (name, city_id)
SELECT 'Garki', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Wuse', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Maitama', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Asokoro', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Central Business District', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Utako', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Jabi', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Life Camp', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Gwarinpa', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
UNION ALL SELECT 'Kubwa', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Municipal Area Council' AND s.name = 'FCT'
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert Port Harcourt areas
INSERT INTO areas (name, city_id)
SELECT 'GRA Phase 1', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Port Harcourt' AND s.name = 'Rivers'
UNION ALL SELECT 'GRA Phase 2', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Port Harcourt' AND s.name = 'Rivers'
UNION ALL SELECT 'Old GRA', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Port Harcourt' AND s.name = 'Rivers'
UNION ALL SELECT 'Trans Amadi', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Port Harcourt' AND s.name = 'Rivers'
UNION ALL SELECT 'D-Line', c.id FROM cities c JOIN states s ON c.state_id = s.id WHERE c.name = 'Port Harcourt' AND s.name = 'Rivers'
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert popular landmarks
INSERT INTO landmarks (name, landmark_type, area_id)
-- Lekki landmarks
SELECT 'The Palms Shopping Mall', 'mall', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
UNION ALL SELECT 'Lekki Phase 1 Roundabout', 'roundabout', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
UNION ALL SELECT 'Admiralty Way', 'street', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
UNION ALL SELECT 'Lekki Conservation Centre', 'park', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Lekki Phase 1' AND s.name = 'Lagos'
-- Victoria Island landmarks
UNION ALL SELECT 'Eko Hotel', 'hotel', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Victoria Island' AND s.name = 'Lagos'
UNION ALL SELECT 'The Civic Centre', 'venue', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Victoria Island' AND s.name = 'Lagos'
UNION ALL SELECT 'Bar Beach', 'beach', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Victoria Island' AND s.name = 'Lagos'
-- Ikoyi landmarks
UNION ALL SELECT 'Falomo Bridge', 'bridge', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Ikoyi' AND s.name = 'Lagos'
UNION ALL SELECT 'Ikoyi Club', 'club', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Ikoyi' AND s.name = 'Lagos'
-- Yaba landmarks
UNION ALL SELECT 'University of Lagos', 'university', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Yaba' AND s.name = 'Lagos'
UNION ALL SELECT 'Yaba College of Technology', 'college', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Yaba' AND s.name = 'Lagos'
UNION ALL SELECT 'Tejuosho Market', 'market', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Yaba' AND s.name = 'Lagos'
-- Abuja landmarks
UNION ALL SELECT 'Aso Rock', 'landmark', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Garki' AND s.name = 'FCT'
UNION ALL SELECT 'National Assembly', 'government', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Maitama' AND s.name = 'FCT'
UNION ALL SELECT 'Sheraton Hotel', 'hotel', a.id FROM areas a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id WHERE a.name = 'Garki' AND s.name = 'FCT'
ON CONFLICT (name, area_id) DO NOTHING;