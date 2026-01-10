import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    profileVisibility: 'public',
    dataSharing: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Privacy & Security</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Password Section */}
          <div>
            <h3 className="font-semibold mb-3">Password</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border border-border rounded-lg pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                Change Password
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="font-semibold mb-3">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('twoFactorAuth')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-muted-foreground">Share data for better recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('dataSharing')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.dataSharing ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.dataSharing ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="font-semibold mb-3">Privacy</h3>
            <div className="p-4 border border-border rounded-lg">
              <label className="block text-sm font-medium mb-2">Profile Visibility</label>
              <select 
                value={settings.profileVisibility}
                onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacySecurity;