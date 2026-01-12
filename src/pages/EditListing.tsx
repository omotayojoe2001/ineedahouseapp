import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          location: data.location || '',
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({ title: 'Error', description: 'Failed to load property', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          location: formData.location,
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Listing updated successfully' });
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating property:', error);
      toast({ title: 'Error', description: 'Failed to update listing', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout activeTab="profile">
        <div className="bg-white min-h-screen desktop-nav-spacing flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading property...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab="profile">
      <div className="bg-white min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/my-listings')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Edit Listing</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Property Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
              placeholder="Property title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:border-green-500 resize-none"
              placeholder="Property description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₦)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                placeholder="Lagos, Nigeria"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                placeholder="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                placeholder="2"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EditListing;