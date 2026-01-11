import React, { useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, RefreshCw, Settings } from 'lucide-react';

const LocationPermissionHelper = () => {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [testing, setTesting] = useState(false);

  const checkPermission = async () => {
    setTesting(true);
    
    try {
      // Check permission API if available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({name: 'geolocation'});
        setPermissionStatus(permission.state);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      } else {
        setPermissionStatus('api_not_available');
      }
    } catch (error) {
      setPermissionStatus('error');
    }
    
    setTesting(false);
  };

  const requestLocation = () => {
    setTesting(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTesting(false);
        alert(`✅ Location access granted!\nLat: ${position.coords.latitude.toFixed(6)}\nLng: ${position.coords.longitude.toFixed(6)}\nAccuracy: ±${position.coords.accuracy}m`);
        setPermissionStatus('granted');
      },
      (error) => {
        setTesting(false);
        let message = '';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = '❌ Permission denied by user or browser';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            message = '📍 Location unavailable - GPS/network issue';
            break;
          case error.TIMEOUT:
            message = '⏱️ Location request timed out';
            break;
        }
        
        alert(message + `\n\nError details: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const getStatusColor = () => {
    switch(permissionStatus) {
      case 'granted': return 'text-green-600 bg-green-50 border-green-200';
      case 'denied': return 'text-red-600 bg-red-50 border-red-200';
      case 'prompt': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch(permissionStatus) {
      case 'granted': return <CheckCircle className="text-green-600" size={20} />;
      case 'denied': return <AlertTriangle className="text-red-600" size={20} />;
      case 'prompt': return <MapPin className="text-yellow-600" size={20} />;
      default: return <Settings className="text-gray-600" size={20} />;
    }
  };

  const getInstructions = () => {
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (permissionStatus === 'denied') {
      return (
        <div className="space-y-3 text-sm">
          <p className="font-medium">🔧 How to fix location access:</p>
          
          {isChrome && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Chrome:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Click the 🔒 lock icon in address bar</li>
                <li>Set Location to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          )}
          
          {isSafari && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Safari:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Go to Safari → Settings → Websites</li>
                <li>Click "Location" in left sidebar</li>
                <li>Set this website to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          )}
          
          {isFirefox && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Firefox:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Click the 🛡️ shield icon in address bar</li>
                <li>Click "Allow Location Access"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          )}
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-800">If still not working:</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Try incognito/private mode</li>
              <li>Clear browser cache and cookies</li>
              <li>Check if location is enabled in device settings</li>
              <li>Try a different browser</li>
            </ul>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="text-blue-500" />
          Location Permission Helper
        </h3>
        
        <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="font-medium">
              Permission Status: {permissionStatus.replace('_', ' ')}
            </span>
          </div>
          
          {permissionStatus === 'unknown' && (
            <p className="text-sm">Click "Check Permission" to see current status</p>
          )}
        </div>
        
        <div className="space-y-2">
          <button
            onClick={checkPermission}
            disabled={testing}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Settings size={16} />
            )}
            Check Permission
          </button>
          
          <button
            onClick={requestLocation}
            disabled={testing}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <MapPin size={16} />
            )}
            Request Location Access
          </button>
        </div>
        
        {getInstructions()}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>🌐 Browser: {navigator.userAgent.split(' ')[0]}</p>
          <p>📱 Platform: {navigator.platform}</p>
          <p>🔒 HTTPS: {location.protocol === 'https:' ? 'Yes' : 'No (Required for location)'}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionHelper;