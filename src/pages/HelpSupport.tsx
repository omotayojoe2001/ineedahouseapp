import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
  const navigate = useNavigate();

  const supportOptions = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat' },
    { icon: Phone, title: 'Call Support', description: '+234 800 123 4567', action: 'Call Now' },
    { icon: Mail, title: 'Email Support', description: 'support@ineedahouse.com', action: 'Send Email' },
  ];

  const helpTopics = [
    { icon: HelpCircle, title: 'Getting Started', description: 'Learn the basics' },
    { icon: FileText, title: 'Property Listings', description: 'How to list your property' },
    { icon: Users, title: 'Account Management', description: 'Manage your account settings' },
  ];

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Help & Support</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Contact Support */}
          <div>
            <h3 className="font-semibold mb-3">Contact Support</h3>
            <div className="space-y-3">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-primary" />
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                      {option.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help Topics */}
          <div>
            <h3 className="font-semibold mb-3">Help Topics</h3>
            <div className="space-y-3">
              {helpTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <button key={index} className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                    <Icon size={20} className="text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">{topic.title}</p>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
            <div className="space-y-2">
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer">How do I list my property?</summary>
                <p className="text-sm text-muted-foreground mt-2">Click the plus button in the navigation or go to My Listings and click "Add New Listing".</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer">How do I contact a landlord?</summary>
                <p className="text-sm text-muted-foreground mt-2">Click on any property and use the contact options provided.</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer">Is my data secure?</summary>
                <p className="text-sm text-muted-foreground mt-2">Yes, we use industry-standard encryption to protect your data.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpSupport;