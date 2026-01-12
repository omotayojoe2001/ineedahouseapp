import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Home, Search, Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GettingStarted = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: User,
      title: 'Create Your Account',
      description: 'Sign up with your email to get started with INeedAHouse',
      details: ['Click "Sign Up" on the login page', 'Enter your email and password', 'Verify your email address']
    },
    {
      icon: Search,
      title: 'Search for Properties',
      description: 'Use our search to find properties that match your needs',
      details: ['Use the search bar on the home page', 'Filter by location, price, and property type', 'Save properties you like by tapping the heart icon']
    },
    {
      icon: Heart,
      title: 'Save Your Favorites',
      description: 'Keep track of properties you are interested in',
      details: ['Tap the heart icon on any property', 'View all saved properties in "Saved Properties"', 'Remove properties by tapping the heart again']
    },
    {
      icon: Home,
      title: 'List Your Property',
      description: 'Rent out your own property to earn money',
      details: ['Go to "My Listings" and tap "Add New Listing"', 'Fill in property details and upload photos', 'Publish your listing to start receiving inquiries']
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
            <h1 className="text-xl font-bold">Getting Started</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Welcome to INeedAHouse!</h2>
            <p className="text-muted-foreground">Follow these simple steps to get the most out of our platform.</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Icon size={24} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GettingStarted;