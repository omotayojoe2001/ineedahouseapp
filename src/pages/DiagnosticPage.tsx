import React from 'react';
import Layout from '../components/Layout';
import LocationDiagnostic from '../components/LocationDiagnostic';

const DiagnosticPage = () => {
  return (
    <Layout activeTab="profile">
      <div className="min-h-screen bg-gray-50">
        <LocationDiagnostic />
      </div>
    </Layout>
  );
};

export default DiagnosticPage;