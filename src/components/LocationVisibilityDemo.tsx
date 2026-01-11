import React, { useState } from 'react';
import { MapPin, Eye, EyeOff, Info } from 'lucide-react';

const LocationVisibilityDemo = () => {
  const [showExact, setShowExact] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="text-blue-500" />
          What Others See When Viewing Your Property
        </h3>
        
        <div className="space-y-4">
          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Show Exact Location</p>
              <p className="text-sm text-gray-600">Let viewers see precise address</p>
            </div>
            <button
              onClick={() => setShowExact(!showExact)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showExact ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showExact ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Map Preview */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 border-b">
              <p className="text-sm font-medium">Map View for Property Viewers:</p>
            </div>
            
            <div className="h-64 bg-gray-200 relative">
              {/* Simulated map */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
              
              {showExact ? (
                // Exact location pin
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="w-1 h-4 bg-red-500 mx-auto"></div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                    📍 14 Hassan Street, Oshodi
                  </div>
                </div>
              ) : (
                // Approximate area circle
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-red-200 rounded-full border-2 border-red-400 opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-xs">
                    📍 Oshodi Area
                  </div>
                </div>
              )}
              
              {/* Street labels */}
              <div className="absolute top-4 left-4 text-xs text-gray-600">Allen Avenue</div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-600">Agege Motor Road</div>
              <div className="absolute top-4 right-4 text-xs text-gray-600">Oshodi-Apapa Expressway</div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Info className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm">
                <p className="font-medium text-blue-800">
                  {showExact ? 'Exact Location Mode' : 'Privacy Mode (Recommended)'}
                </p>
                <p className="text-blue-700">
                  {showExact 
                    ? 'Viewers see your exact address and can find your property easily. Use for commercial properties.'
                    : 'Viewers see general area only. Exact address shared after contact. Better for residential privacy.'
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-1">🏠 Residential Properties</p>
                <p className="text-gray-600">Show area only for privacy</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-1">🏢 Commercial Properties</p>
                <p className="text-gray-600">Show exact location for visibility</p>
              </div>
            </div>
          </div>

          {/* Address Display */}
          <div className="border rounded-lg p-4">
            <p className="font-medium mb-2">Address Shown to Viewers:</p>
            <div className="bg-gray-50 p-3 rounded">
              {showExact ? (
                <p className="text-sm">📍 14 Hassan Street, Oshodi, Lagos State</p>
              ) : (
                <p className="text-sm">📍 Oshodi Area, Lagos State</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {showExact 
                ? 'Full address visible to all viewers'
                : 'Exact address shared only after viewer contacts you'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationVisibilityDemo;