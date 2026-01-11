import React, { useState } from 'react';
import Layout from '../components/Layout';
import { importLocationData, testLocationImport } from '../utils/importLocations';
import { Download, Database, TestTube, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLocationPage = () => {
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    console.log('🚀 Starting location import...');
    await importLocationData();
    // Refresh stats after import
    setTimeout(checkDatabase, 2000);
  };

  const handleTest = async () => {
    console.log('🧪 Testing data sources...');
    await testLocationImport();
  };

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Count states
      const { count: statesCount } = await supabase
        .from('states')
        .select('*', { count: 'exact', head: true });

      // Count cities/LGAs
      const { count: citiesCount } = await supabase
        .from('cities')
        .select('*', { count: 'exact', head: true });

      // Get sample data
      const { data: sampleStates } = await supabase
        .from('states')
        .select('name, code')
        .limit(5);

      const { data: sampleCities } = await supabase
        .from('cities')
        .select('name, states(name)')
        .limit(5);

      setDbStats({
        statesCount,
        citiesCount,
        sampleStates,
        sampleCities
      });
    } catch (error) {
      console.error('Error checking database:', error);
    }
    setLoading(false);
  };

  return (
    <Layout activeTab="profile">
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Location Data Management</h1>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <TestTube className="text-blue-500" size={24} />
              <h2 className="text-lg font-semibold">Test Data Sources</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Test if GitHub repositories are accessible
            </p>
            <button
              onClick={handleTest}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <TestTube size={16} />
              Test Sources
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Download className="text-green-500" size={24} />
              <h2 className="text-lg font-semibold">Import Nigerian Locations</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Import all 36 states and 774+ LGAs from GitHub repositories
            </p>
            <button
              onClick={handleImport}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Download size={16} />
              Import All Locations
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-purple-500" size={24} />
              <h2 className="text-lg font-semibold">Check Database</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Check current database status and imported data
            </p>
            <button
              onClick={checkDatabase}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2 disabled:opacity-50"
            >
              <Search size={16} />
              {loading ? 'Checking...' : 'Check Database'}
            </button>
            
            {dbStats && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Database Status:</h3>
                <div className="space-y-2 text-sm">
                  <p>• <strong>States:</strong> {dbStats.statesCount} records</p>
                  <p>• <strong>Cities/LGAs:</strong> {dbStats.citiesCount} records</p>
                  
                  {dbStats.sampleStates && (
                    <div>
                      <p className="font-medium mt-3">Sample States:</p>
                      {dbStats.sampleStates.map((state: any) => (
                        <p key={state.name} className="ml-4">• {state.name} ({state.code})</p>
                      ))}
                    </div>
                  )}
                  
                  {dbStats.sampleCities && (
                    <div>
                      <p className="font-medium mt-3">Sample Cities:</p>
                      {dbStats.sampleCities.map((city: any) => (
                        <p key={city.name} className="ml-4">• {city.name} - {city.states?.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <TestTube className="text-orange-500" size={24} />
              <h2 className="text-lg font-semibold">Instructions</h2>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Step 1:</strong> Click "Import All Locations" to populate database</p>
              <p>• <strong>Step 2:</strong> Click "Check Database" to verify import</p>
              <p>• <strong>Step 3:</strong> Go to /create-rent-listing to test dropdowns</p>
              <p>• <strong>Expected:</strong> 37 states, 774+ LGAs</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLocationPage;