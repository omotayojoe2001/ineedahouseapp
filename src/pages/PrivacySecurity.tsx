import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    profileVisibility: 'public',
    dataSharing: false,
  });

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Password updated successfully' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: 'Setting Updated', description: `${key} has been ${settings[key] ? 'disabled' : 'enabled'}` });
  };

  const handleProfileVisibilityChange = (value: string) => {
    setSettings(prev => ({ ...prev, profileVisibility: value }));
    toast({ title: 'Privacy Updated', description: `Profile visibility set to ${value}` });
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
            <h3 className="font-semibold mb-3 text-green-600">Password</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg pr-10 focus:border-green-500"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg pr-10 focus:border-green-500"
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-green-500"
                  placeholder="Confirm new password"
                />
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-green-700"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="font-semibold mb-3 text-green-600">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-green-500" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('twoFactorAuth')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-green-500' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-green-500" />
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-muted-foreground">Share data for better recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('dataSharing')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.dataSharing ? 'bg-green-500' : 'bg-muted'
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
            <h3 className="font-semibold mb-3 text-green-600">Privacy</h3>
            <div className="p-4 border border-border rounded-lg">
              <label className="block text-sm font-medium mb-2">Profile Visibility</label>
              <select 
                value={settings.profileVisibility}
                onChange={(e) => handleProfileVisibilityChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-green-500"
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