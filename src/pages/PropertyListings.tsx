import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Home, Camera, MapPin, DollarSign, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyListings = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Home,
      title: 'Creating Your First Listing',
      items: [
        'Go to "My Listings" from your profile',
        'Tap "Add New Listing" button',
        'Choose your property type (House, Commercial, Shop, Event Center)',
        'Fill in basic details like title and description'
      ]
    },
    {
      icon: Camera,
      title: 'Adding Photos',
      items: [
        'Upload high-quality photos of your property',
        'Include photos of all rooms and exterior',
        'Make sure photos are well-lit and clear',
        'You can upload up to 10 photos per listing'
      ]
    },
    {
      icon: MapPin,
      title: 'Setting Location',
      items: [
        'Enter your property address accurately',
        'Add nearby landmarks for easy identification',
        'Select the correct state, city, and area',
        'Double-check the location details before publishing'
      ]
    },
    {
      icon: DollarSign,
      title: 'Pricing Your Property',
      items: [
        'Research similar properties in your area',
        'Set competitive rent and deposit amounts',
        'Include all fees (service charge, agreement fee, etc.)',
        'Be transparent about additional costs'
      ]
    },
    {
      icon: Edit,
      title: 'Managing Your Listings',
      items: [
        'Edit your listings anytime from "My Listings"',
        'Update availability and pricing as needed',
        'Respond promptly to inquiries',
        'Keep your listing information current'
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
            <h1 className="text-xl font-bold">Property Listings</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-2">How to List Your Property</h2>
            <p className="text-muted-foreground">Complete guide to creating and managing successful property listings.</p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Icon size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
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

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Pro Tips</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Properties with photos get 5x more views</li>
              <li>• Detailed descriptions increase inquiry rates</li>
              <li>• Competitive pricing attracts more tenants</li>
              <li>• Quick responses build trust with potential tenants</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyListings;