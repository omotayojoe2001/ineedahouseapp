import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    profilePicture: null as File | null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: user.email || '',
            phone: data.phone || '',
            address: '',
            dateOfBirth: '',
            profilePicture: null,
          });
          
          // Set avatar preview if exists
          if (data.avatar_url) {
            console.log('🖼️ Loading saved avatar:', data.avatar_url);
            // Create a fake file object for preview
            fetch(data.avatar_url)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                setFormData(prev => ({ ...prev, profilePicture: file }));
              })
              .catch(err => console.log('Could not load avatar preview:', err));
          }
        } else {
          // Pre-fill with user email if no profile exists
          setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePicture: e.target.files![0] }));
    }
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    
    console.log('📝 Form data:', formData);
    
    try {
      let avatarUrl = null;
      
      // Upload profile picture if selected
      if (formData.profilePicture) {
        console.log('📸 Uploading profile picture:', formData.profilePicture.name);
        
        // Compress image before upload
        const compressedImage = await new Promise<Blob>((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          
          image.onload = () => {
            const maxSize = 400;
            const ratio = Math.min(maxSize / image.width, maxSize / image.height);
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
          };
          
          image.src = URL.createObjectURL(formData.profilePicture!);
        });
        
        const fileName = `${user.id}.jpg`;
        console.log('📁 File name:', fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, compressedImage, { upsert: true });
        
        console.log('📤 Upload result:', { uploadData, uploadError });
        
        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
          console.log('🔗 Avatar URL:', avatarUrl);
        } else {
          console.error('❌ Upload error:', uploadError);
        }
      }
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      console.log('💾 Profile data to save:', profileData);
      
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            ...profileData
          });

        if (error) throw error;
      }

      console.log('✅ Profile saved successfully');
      
      // Refetch profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (updatedProfile) {
        setFormData(prev => ({
          ...prev,
          firstName: updatedProfile.first_name || '',
          lastName: updatedProfile.last_name || '',
          phone: updatedProfile.phone || '',
          profilePicture: null,
        }));
        
        // Load avatar preview if exists
        if (updatedProfile.avatar_url) {
          fetch(updatedProfile.avatar_url)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
              setFormData(prev => ({ ...prev, profilePicture: file }));
            })
            .catch(err => console.log('Could not load avatar preview:', err));
        }
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout activeTab="profile">
        <div className="bg-background min-h-screen desktop-nav-spacing flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Personal Information</h1>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 py-6">
          {/* Profile Picture */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {formData.profilePicture ? (
                  <img 
                    src={URL.createObjectURL(formData.profilePicture)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-muted-foreground" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary-hover">
                <Camera size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Click camera icon to upload photo</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-muted"
                placeholder="Enter email"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg h-20"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalInfo;