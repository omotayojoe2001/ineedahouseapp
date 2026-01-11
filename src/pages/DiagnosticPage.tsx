import React from 'react';
import Layout from '../components/Layout';
import LocationDiagnostic from '../components/LocationDiagnostic';
import LocationPermissionHelper from '../components/LocationPermissionHelper';

const DiagnosticPage = () => {
  return (
    <Layout activeTab="profile">
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <LocationPermissionHelper />
          <LocationDiagnostic />
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticPage;