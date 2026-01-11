import React from 'react';
import Layout from '../components/Layout';
import LocationVisibilityDemo from '../components/LocationVisibilityDemo';

const LocationVisibilityPage = () => {
  return (
    <Layout activeTab="profile">
      <div className="min-h-screen bg-gray-50">
        <LocationVisibilityDemo />
      </div>
    </Layout>
  );
};

export default LocationVisibilityPage;