import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Heart, 
  Home, 
  MessageSquare, 
  HelpCircle, 
  Shield, 
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Star,
  Award,
  Moon,
  Sun
} from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ listings: 0, saved: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('🔍 Profile page - User ID:', user.id);
        console.log('👤 Profile page - Profile data:', profileData);

        // Fetch stats from all tables
        const statsPromises = [];
        let totalListings = 0;
        
        // Properties
        try {
          const { count } = await supabase.from('properties').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Properties table not accessible'); }
        
        // Shortlets
        try {
          const { count } = await supabase.from('shortlets').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Shortlets table not accessible'); }
        
        // Sale properties
        try {
          const { count } = await supabase.from('sale_properties').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Sale properties table not accessible'); }
        
        // Services
        try {
          const { count } = await supabase.from('services').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Services table not accessible'); }
        
        // Shops
        try {
          const { count } = await supabase.from('shops').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Shops table not accessible'); }
        
        // Event centers
        try {
          const { count } = await supabase.from('event_centers').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalListings += count || 0;
        } catch (error) { console.log('Event centers table not accessible'); }
        
        // Favorites
        let totalSaved = 0;
        try {
          const { count } = await supabase.from('property_favorites').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalSaved += count || 0;
        } catch (error) { console.log('Property favorites table not accessible'); }
        
        try {
          const { count } = await supabase.from('shortlet_favorites').select('id', { count: 'exact' }).eq('user_id', user.id);
          totalSaved += count || 0;
        } catch (error) { console.log('Shortlet favorites table not accessible'); }

        // Unread messages
        let unreadMessages = 0;
        try {
          const { count } = await supabase.from('messages').select('id', { count: 'exact' }).eq('recipient_id', user.id).eq('read', false);
          unreadMessages = count || 0;
        } catch (error) { console.log('Messages table not accessible'); }

        setProfile(profileData);
        setStats({
          listings: totalListings,
          saved: totalSaved,
          messages: unreadMessages
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Format member since date
  const getMemberSince = () => {
    if (!user?.created_at) return 'Recently joined';
    const date = new Date(user.created_at);
    return `Member since ${date.getFullYear()}`;
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.first_name && profile?.last_name) return `${profile.first_name} ${profile.last_name}`;
    if (profile?.first_name) return profile.first_name;
    return user?.email?.split('@')[0] || 'User';
  };

  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      description: 'Update your details',
      color: 'text-green-500',
      path: '/personal-info',
    },
    {
      icon: Home,
      title: 'My Listings',
      description: `${stats.listings} active properties`,
      color: 'text-green-500',
      path: '/my-listings',
    },
    {
      icon: Heart,
      title: 'Saved Properties',
      description: `${stats.saved} saved items`,
      color: 'text-green-500',
      path: '/saved',
    },
    {
      icon: MessageSquare,
      title: 'Messages',
      description: `${stats.messages} unread messages`,
      color: 'text-green-500',
      path: '/messages',
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage cards and payments',
      color: 'text-green-500',
      path: '/payment-methods',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Customize your alerts',
      color: 'text-green-500',
      path: '/notifications',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Account security settings',
      color: 'text-green-500',
      path: '/privacy-security',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact us',
      color: 'text-green-500',
      path: '/help-support',
    },
  ];

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header with Profile Info */}
        <div className="px-4 pt-12 pb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-center">
            {/* Profile Picture */}
            <div className="relative inline-block mb-4">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={32} className="text-primary-foreground" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <Award size={16} className="text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <h1 className="text-xl font-bold text-foreground mb-1">
              {loading ? 'Loading...' : getDisplayName()}
            </h1>
            <p className="text-muted-foreground mb-2">
              {user?.email || 'No email provided'}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" />
                <span className="font-medium">4.9</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span className="text-muted-foreground">Verified Host</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span className="text-muted-foreground">{getMemberSince()}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-2">
          {/* Dark Mode Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-full flex items-center p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className={`p-2 rounded-lg bg-muted ${isDark ? 'text-yellow-500' : 'text-blue-500'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div className="flex-1 ml-4 text-left">
                <h3 className="font-medium text-foreground">{isDark ? 'Light Mode' : 'Dark Mode'}</h3>
                <p className="text-sm text-muted-foreground">Switch to {isDark ? 'light' : 'dark'} theme</p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
          
          {/* Inspector Section - Dynamic based on status */}
          <div className="mb-4">
            {(() => {
              const isInspector = false; // This would come from user profile/database
              
              if (isInspector) {
                return (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Inspector Dashboard</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manage your inspections and earnings
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          You've earned ₦45,000 this month
                        </p>
                        <button 
                          className="mt-3 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          onClick={() => navigate('/inspector-dashboard')}
                        >
                          View Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Become a Property Inspector</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Earn money by helping people verify properties in your area
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Earn ₦5,000 - ₦15,000 per inspection
                        </p>
                        <button 
                          className="mt-3 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          onClick={() => navigate('/inspector-registration')}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
          
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center p-4 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 ml-4 text-left">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-4 py-6 border-t border-border mt-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center p-4 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-red-100">
              <LogOut size={20} className="text-red-500" />
            </div>
            <div className="flex-1 ml-4 text-left">
              <h3 className="font-medium text-red-600">Log Out</h3>
              <p className="text-sm text-red-400">Sign out of your account</p>
            </div>
            <ChevronRight size={20} className="text-red-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* App Version */}
        <div className="px-4 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            INeedAHouse v1.0.0
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;