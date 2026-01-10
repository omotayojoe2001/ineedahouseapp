import React, { useState } from 'react';
import { Heart, User, Home, Plus, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreateListingModal from './CreateListingModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'search' | 'upload' | 'messages' | 'profile';
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'home' }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: Heart, label: 'Saved', path: '/saved' },
    { id: 'upload', icon: Plus, label: '', isCenter: true, path: '/create' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/messages' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.id === 'upload') {
      if (user) {
        setShowCreateModal(true);
      } else {
        navigate('/auth', { state: { from: location } });
      }
      return;
    }
    
    if (!user && (tab.id === 'search' || tab.id === 'messages' || tab.id === 'profile')) {
      navigate('/auth', { state: { from: location } });
      return;
    }
    
    if (tab.path) {
      navigate(tab.path);
    }
  };

  const handleAuthRequired = () => {
    setShowCreateModal(false);
    navigate('/auth', { state: { from: location } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 w-full bg-card border-b border-border z-50">
        <div className="w-full px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <h1 className="text-lg lg:text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>PropertyApp</h1>
              {tabs.filter(tab => !tab.isCenter).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handleTabClick(tabs.find(tab => tab.isCenter)!)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-hover transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Create Listing</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-6 lg:pt-16">
        {children}
      </main>
      
      {/* Bottom Navigation - Mobile and Tablet */}
      <nav className="fixed bottom-0 left-0 w-full bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-center py-2 px-2">
          <div className="flex items-center justify-between w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCenter = tab.isCenter;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    isCenter
                      ? 'bg-primary text-primary-foreground rounded-full p-3 shadow-lg transform hover:scale-105 -mt-2 mx-2'
                      : `flex-1 py-2 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
                  }`}
                >
                  <Icon 
                    size={isCenter ? 20 : 18} 
                    className={isActive && !isCenter ? 'stroke-2' : 'stroke-1.5'} 
                  />
                  {!isCenter && tab.label && (
                    <span className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <CreateListingModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAuthRequired={handleAuthRequired}
      />
    </div>
  );
};

export default Layout;