import { GitHubLocationImporter } from '../services/githubLocationImporter';

// Simple function to import comprehensive Nigerian location data
export const importLocationData = async () => {
  try {
    console.log('🔄 Starting comprehensive location import...');
    
    const success = await GitHubLocationImporter.importNigerianLocations();
    
    if (success) {
      alert('✅ Successfully imported all Nigerian states and LGAs!');
    } else {
      alert('❌ Failed to import location data. Check console for details.');
    }
    
    return success;
  } catch (error) {
    console.error('Error importing location data:', error);
    alert('❌ Error importing location data. Check console for details.');
    return false;
  }
};

// Quick test function
export const testLocationImport = async () => {
  console.log('🧪 Testing location data sources...');
  
  const sources = [
    'https://raw.githubusercontent.com/temikeezy/nigeria-geojson-data/main/data/lgas.json',
    'http://states-and-cities.com/api/v1/states'
  ];
  
  for (const url of sources) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(`✅ ${url} - Working! Sample:`, Object.keys(data).slice(0, 3));
    } catch (error) {
      console.log(`❌ ${url} - Failed:`, error);
    }
  }
};