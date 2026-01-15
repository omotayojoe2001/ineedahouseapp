import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Phone, MessageCircle, MapPin, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  const getDisplayName = () => {
    if (!profile) return 'User';
    if (profile.full_name) return profile.full_name;
    if (profile.first_name && profile.last_name) return `${profile.first_name} ${profile.last_name}`;
    if (profile.first_name) return profile.first_name;
    return 'User';
  };

  const getMemberSince = () => {
    if (!profile?.created_at) return 'Recently joined';
    const date = new Date(profile.created_at);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">User Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6">
        {/* Profile Picture & Name */}
        <div className="text-center mb-6">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <span className="text-3xl text-primary-foreground font-bold">
                {getDisplayName()[0].toUpperCase()}
              </span>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-1">{getDisplayName()}</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>{getMemberSince()}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">Contact Information</h3>
          <div className="space-y-3">
            {profile.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${profile.phone}`)}
                >
                  Call
                </Button>
              </div>
            )}
            {profile.whatsapp_number && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-green-600" />
                  <span className="text-sm">{profile.whatsapp_number}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}`,
                      '_blank'
                    )
                  }
                >
                  WhatsApp
                </Button>
              </div>
            )}
            {!profile.phone && !profile.whatsapp_number && (
              <p className="text-sm text-muted-foreground">No contact information available</p>
            )}
          </div>
        </div>

        {/* Location */}
        {profile.location && (
          <div className="bg-card rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Location</h3>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-muted-foreground" />
              <span className="text-sm">{profile.location}</span>
            </div>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="bg-card rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {/* Action Buttons */}
        {user && user.id !== id && (
          <div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-white border-t border-border">
            <Button
              className="w-full bg-primary hover:bg-primary-hover"
              onClick={() => navigate(`/messages/${id}`)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Send Message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
