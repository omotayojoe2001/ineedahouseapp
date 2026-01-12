// Test script to verify edit listing functionality
// Run this in browser console after creating and editing a listing

const testEditFlow = async () => {
  console.log('🧪 Testing Edit Listing Flow...');
  
  // Test 1: Check if description field exists in form
  const descriptionField = document.querySelector('textarea[placeholder*="Describe your rental property"]');
  console.log('✅ Description field exists:', !!descriptionField);
  
  // Test 2: Check if Step 3 fields are present
  const step3Fields = [
    'livingRoom',
    'diningArea', 
    'kitchenCabinets',
    'countertop',
    'heatExtractor',
    'balcony',
    'storage',
    'electricityType',
    'transformer',
    'generator',
    'waterSupply',
    'internetReady',
    'gatedCompound',
    'security24_7',
    'cctv',
    'parkingSpaces'
  ];
  
  console.log('🔍 Checking Step 3 fields...');
  step3Fields.forEach(field => {
    const element = document.querySelector(`select[value*="${field}"], input[value*="${field}"]`);
    console.log(`  ${field}:`, !!element ? '✅' : '❌');
  });
  
  // Test 3: Check if amenities checkboxes exist
  const amenityCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  console.log('✅ Amenity checkboxes count:', amenityCheckboxes.length);
  
  // Test 4: Check if tenant preferences fields exist
  const allowsPetsField = document.querySelector('select[value*="allowsPets"]');
  const tenantPrefField = document.querySelector('select[value*="tenantPreference"]');
  console.log('✅ Allows Pets field:', !!allowsPetsField);
  console.log('✅ Tenant Preference field:', !!tenantPrefField);
  
  // Test 5: Check if edit mode is detected
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  console.log('✅ Edit mode detected:', !!editId);
  
  if (editId) {
    console.log('📝 Edit ID:', editId);
    
    // Test 6: Check if form is pre-filled (look for non-empty values)
    const titleField = document.querySelector('input[placeholder*="Modern 3-Bedroom"]');
    const hasTitle = titleField && titleField.value.length > 0;
    console.log('✅ Title pre-filled:', hasTitle);
    
    const descField = document.querySelector('textarea[placeholder*="Describe your rental"]');
    const hasDescription = descField && descField.value.length > 0;
    console.log('✅ Description pre-filled:', hasDescription);
  }
  
  console.log('🎯 Test Summary:');
  console.log('- All critical fields should be present');
  console.log('- Edit mode should pre-fill existing data');
  console.log('- Step 3 amenities should be checkboxes');
  console.log('- Tenant preferences should be dropdowns');
  console.log('- Update should not create duplicates');
};

// Auto-run test
testEditFlow();