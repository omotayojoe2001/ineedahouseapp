import React, { useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

const LocationDiagnostic = () => {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostic = () => {
    setTesting(true);
    setResults([]);
    
    const tests = [
      // Test 1: Basic geolocation support
      {
        name: "Geolocation Support",
        test: () => Promise.resolve(!!navigator.geolocation),
        expected: true
      },
      
      // Test 2: Permission status
      {
        name: "Location Permission",
        test: async () => {
          if ('permissions' in navigator) {
            const permission = await navigator.permissions.query({name: 'geolocation'});
            return permission.state;
          }
          return 'unknown';
        },
        expected: 'granted'
      },
      
      // Test 3: Low accuracy location
      {
        name: "Low Accuracy GPS",
        test: () => new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp
            }),
            (err) => reject(err.message),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
          );
        }),
        expected: 'coordinates'
      },
      
      // Test 4: High accuracy location
      {
        name: "High Accuracy GPS",
        test: () => new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp
            }),
            (err) => reject(err.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          );
        }),
        expected: 'coordinates'
      },
      
      // Test 5: Network location
      {
        name: "Network Info",
        test: () => {
          const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
          return {
            type: connection?.effectiveType || 'unknown',
            downlink: connection?.downlink || 'unknown',
            rtt: connection?.rtt || 'unknown'
          };
        },
        expected: 'info'
      }
    ];
    
    runTests(tests);
  };
  
  const runTests = async (tests: any[]) => {
    const testResults = [];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        testResults.push({
          name: test.name,
          status: 'success',
          result: result,
          expected: test.expected
        });
      } catch (error) {
        testResults.push({
          name: test.name,
          status: 'error',
          result: error,
          expected: test.expected
        });
      }
    }
    
    setResults(testResults);
    setTesting(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const actualLocation = { lat: 6.655524, lng: 3.194123 }; // Your actual location

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Navigation className="text-blue-500" />
          GPS Location Diagnostic
        </h2>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm">
            <strong>Your Actual Location:</strong> {actualLocation.lat}, {actualLocation.lng}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            We'll compare GPS results against this to check accuracy
          </p>
        </div>
        
        <button
          onClick={runDiagnostic}
          disabled={testing}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-4"
        >
          {testing ? 'Running Diagnostic...' : 'Run GPS Diagnostic'}
        </button>
        
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results:</h3>
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={16} />
                  )}
                  <span className="font-medium">{result.name}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {result.name.includes('GPS') && result.status === 'success' && (
                    <div className="space-y-1">
                      <p><strong>Coordinates:</strong> {result.result.lat.toFixed(6)}, {result.result.lng.toFixed(6)}</p>
                      <p><strong>Accuracy:</strong> ±{result.result.accuracy}m</p>
                      <p><strong>Distance from actual:</strong> {
                        calculateDistance(
                          actualLocation.lat, actualLocation.lng,
                          result.result.lat, result.result.lng
                        ).toFixed(2)
                      }km</p>
                      <a 
                        href={`https://www.google.com/maps?q=${result.result.lat},${result.result.lng}&z=18`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                  
                  {result.name === 'Location Permission' && (
                    <p><strong>Status:</strong> {result.result}</p>
                  )}
                  
                  {result.name === 'Network Info' && (
                    <div>
                      <p><strong>Connection:</strong> {result.result.type}</p>
                      <p><strong>Speed:</strong> {result.result.downlink} Mbps</p>
                      <p><strong>Latency:</strong> {result.result.rtt}ms</p>
                    </div>
                  )}
                  
                  {result.status === 'error' && (
                    <p className="text-red-600"><strong>Error:</strong> {result.result}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDiagnostic;