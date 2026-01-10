import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Bell, Mail, MessageSquare, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    propertyAlerts: true,
    messageAlerts: true,
    marketingEmails: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    { key: 'pushNotifications', label: 'Push Notifications', icon: Bell, description: 'Receive notifications on your device' },
    { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, description: 'Get updates via email' },
    { key: 'smsNotifications', label: 'SMS Notifications', icon: MessageSquare, description: 'Receive text messages' },
    { key: 'propertyAlerts', label: 'Property Alerts', icon: Home, description: 'New properties matching your criteria' },
    { key: 'messageAlerts', label: 'Message Alerts', icon: MessageSquare, description: 'New messages from landlords' },
    { key: 'marketingEmails', label: 'Marketing Emails', icon: Mail, description: 'Promotional offers and updates' },
  ];

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="space-y-4">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(type.key)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings[type.key] ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings[type.key] ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;