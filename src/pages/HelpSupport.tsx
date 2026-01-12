import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, FileText, Users, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const HelpSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleContact = (type: string, value: string) => {
    if (type === 'chat') {
      toast({ title: 'Live Chat', description: 'Opening chat window...' });
    } else if (type === 'phone') {
      window.open(`tel:${value}`);
    } else if (type === 'email') {
      window.open(`mailto:${value}`);
    }
  };

  const handleSubmitMessage = async () => {
    if (!contactForm.subject || !contactForm.message) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      toast({ title: 'Message Sent', description: 'We will get back to you within 24 hours' });
      setContactForm({ subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const supportOptions = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat', type: 'chat', value: '' },
    { icon: Phone, title: 'Call Support', description: '+234 800 123 4567', action: 'Call Now', type: 'phone', value: '+2348001234567' },
    { icon: Mail, title: 'Email Support', description: 'support@ineedahouse.com', action: 'Send Email', type: 'email', value: 'support@ineedahouse.com' },
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
            <h3 className="font-semibold mb-3 text-green-600">Contact Support</h3>
            <div className="space-y-3">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-green-500" />
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleContact(option.type, option.value)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      {option.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Send Message */}
          <div>
            <h3 className="font-semibold mb-3 text-green-600">Send us a Message</h3>
            <div className="space-y-3 p-4 border border-border rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-green-500"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24 focus:border-green-500 resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button
                onClick={handleSubmitMessage}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>

          {/* Help Topics */}
          <div>
            <h3 className="font-semibold mb-3 text-green-600">Help Topics</h3>
            <div className="space-y-3">
              {helpTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <button 
                    key={index} 
                    onClick={() => {
                      if (topic.title === 'Getting Started') navigate('/getting-started');
                      else if (topic.title === 'Property Listings') navigate('/property-listings');
                      else if (topic.title === 'Account Management') navigate('/account-management');
                    }}
                    className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Icon size={20} className="text-green-500" />
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
            <h3 className="font-semibold mb-3 text-green-600">Frequently Asked Questions</h3>
            <div className="space-y-2">
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer text-green-600">How do I list my property?</summary>
                <p className="text-sm text-muted-foreground mt-2">Click the plus button in the navigation or go to My Listings and click "Add New Listing".</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer text-green-600">How do I contact a landlord?</summary>
                <p className="text-sm text-muted-foreground mt-2">Click on any property and use the contact options provided.</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer text-green-600">Is my data secure?</summary>
                <p className="text-sm text-muted-foreground mt-2">Yes, we use industry-standard encryption to protect your data.</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer text-green-600">How do I change my password?</summary>
                <p className="text-sm text-muted-foreground mt-2">Go to Profile → Privacy & Security and use the password change form.</p>
              </details>
              <details className="p-4 border border-border rounded-lg">
                <summary className="font-medium cursor-pointer text-green-600">How do I delete my account?</summary>
                <p className="text-sm text-muted-foreground mt-2">Contact our support team and we'll help you with account deletion.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpSupport;