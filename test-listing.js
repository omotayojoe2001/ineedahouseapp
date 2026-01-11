// Test script to create a property listing
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wvkoywbpymdymhnbubgx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2a295d2JweW1keW1obmJ1Ymd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5OTQ0MCwiZXhwIjoyMDc0Mzc1NDQwfQ.pjyedqaSG9MOcVvz6Y2yvMPHJDR8JMpf-X2PfRdQDrU'
const supabase = createClient(supabaseUrl, supabaseKey)

const testPropertyData = {
  title: 'Test 3-Bedroom Apartment',
  description: 'Beautiful test apartment for rent',
  category: 'rent',
  property_type: '3 Bedroom Flat',
  price: 250000,
  location: 'Test Location, Lagos',
  
  // Location data
  address: 'Test Address, Lagos',
  bedrooms: 3,
  bathrooms: 2,
  guest_toilet: 1,
  
  // Pricing
  rent_type: 'monthly',
  annual_rent: 250000,
  security_deposit: 500000,
  service_charge: 30000,
  agreement_fee: 150000,
  legal_fee: 100000,
  
  // Building details
  floor_level: 1,
  total_units_in_building: 8,
  
  // Amenities (boolean)
  gym: false,
  air_conditioning: true,
  parking: true,
  swimming_pool: false,
  garden: false,
  elevator: false,
  furnished: false,
  
  // Convert string fields to boolean
  pop_ceiling: true,
  tiled_floors: true,
  
  // Legal documents (boolean)
  certificate_of_occupancy: true,
  deed_of_assignment: true,
  approved_building_plan: true,
  
  // Security (boolean)
  gated_compound: true,
  security_personnel: true,
  cctv_surveillance: true,
  parking_spaces: 2,
  
  // Utilities (remove non-boolean fields)
  public_power: true,
  dedicated_transformer: false,
  backup_generator: true,
  borehole: true,
  treated_water: true,
  fiber_ready: true,
  
  // Lease terms
  available_from: '2025-02-01',
  lease_terms: '1year',
  
  status: 'active'
}

async function testCreateProperty() {
  try {
    console.log('Testing property creation...')
    
    const { data, error } = await supabase
      .from('properties')
      .insert(testPropertyData)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating property:', error)
      return false
    }
    
    console.log('✅ Property created successfully!')
    console.log('Property ID:', data.id)
    console.log('Property Title:', data.title)
    
    // Test adding images
    if (data.id) {
      const imageData = {
        property_id: data.id,
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        is_primary: true,
        order_index: 0
      }
      
      const { error: imageError } = await supabase
        .from('property_images')
        .insert(imageData)
      
      if (imageError) {
        console.error('❌ Error adding image:', imageError)
      } else {
        console.log('✅ Primary image added successfully!')
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

// Run the test
testCreateProperty()