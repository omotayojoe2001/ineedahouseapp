import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, User, Shield, Bell, CreditCard, Heart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: User,
      title: 'Personal Information',
      description: 'Update your profile details',
      items: [
        'Edit your name and contact information',
        'Update your profile photo',
        'Add or change your phone number',
        'Keep your information current for better service'
      ]
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your account security',
      items: [
        'Change your password regularly',
        'Enable two-factor authentication',
        'Control who can see your profile',
        'Manage data sharing preferences'
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Customize your alerts',
      items: [
        'Choose which notifications to receive',
        'Set notification preferences for messages',
        'Control email and push notifications',
        'Manage property update alerts'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      items: [
        'Add or remove payment cards',
        'Set up automatic payments',
        'View payment history',
        'Update billing information'
      ]
    },
    {
      icon: Heart,
      title: 'Saved Properties',
      description: 'Organize your favorites',
      items: [
        'View all your saved properties',
        'Remove properties you are no longer interested in',
        'Get notifications when saved properties are updated',
        'Share saved properties with others'
      ]
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'General account preferences',
      items: [
        'Change your language preferences',
        'Update location settings',
        'Manage app permissions',
        'Delete your account if needed'
      ]
    }
  ];

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/help-support')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Account Management</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Manage Your Account</h2>
            <p className="text-muted-foreground">Learn how to update and customize your account settings.</p>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Icon size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                      <ul className="space-y-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Keep your contact information updated for important notifications</li>
              <li>• Use a strong password and enable two-factor authentication</li>
              <li>• Review your privacy settings regularly</li>
              <li>• Contact support if you need help with any account issues</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountManagement;