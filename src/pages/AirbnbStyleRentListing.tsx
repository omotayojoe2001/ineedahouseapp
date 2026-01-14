import React, { useState } from 'react';
import { ArrowLeft, Home, Building, Store, MapPin, Plus, Minus, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationInputWithMap from '../components/LocationInputWithMap';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AirbnbStyleRentListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: [],
    images: [],
    title: '',
    description: '',
    price: ''
  });

  const propertyTypes = [
    { id: 'entire-place', label: 'An entire place', icon: Home, desc: 'Guests have the whole place to themselves' },
    { id: 'private-room', label: 'A private room', icon: Building, desc: 'Guests have their own room in a shared space' },
    { id: 'shared-room', label: 'A shared room', icon: Store, desc: 'Guests sleep in a room shared with others' }
  ];

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'ac', label: 'Air conditioning', icon: '❄️' },
    { id: 'parking', label: 'Free parking', icon: '🚗' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'tv', label: 'TV', icon: '📺' },
    { id: 'security', label: '24/7 Security', icon: '🔒' }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files].slice(0, 10) }));
  };

  const handleSubmit = async () => {
    try {
      const imagePromises = formData.images.map(async (img) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          image.onload = () => {
            const maxWidth = 800;
            const ratio = Math.min(maxWidth / image.width, maxWidth / image.height);
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          image.src = URL.createObjectURL(img);
        });
      });

      const processedImages = await Promise.all(imagePromises);

      const propertyData = {
        title: formData.title,
        description: formData.description,
        category: 'rent',
        property_type: formData.propertyType,
        price: parseFloat(formData.price),
        location: formData.address,
        address: formData.address,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        images: processedImages,
        user_id: user.id,
        status: 'active',
        // Amenities as boolean fields
        wifi: formData.amenities.includes('wifi'),
        kitchen: formData.amenities.includes('kitchen'),
        air_conditioning: formData.amenities.includes('ac'),
        parking: formData.amenities.includes('parking'),
        swimming_pool: formData.amenities.includes('pool'),
        gym: formData.amenities.includes('gym')
      };

      const { error } = await supabase.from('properties').insert([propertyData]);
      if (error) throw error;

      toast({ title: 'Success!', description: 'Your listing is now live' });
      navigate('/my-listings');
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error', description: 'Failed to create listing', variant: 'destructive' });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-4">What type of place will guests have?</h1>
            <div className="space-y-4 mt-12">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: type.id }))}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      formData.propertyType === type.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={32} />
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{type.label}</div>
                        <div className="text-gray-600 text-sm">{type.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-4">Where's your place located?</h1>
            <p className="text-gray-600 text-xl mb-12">Your address is only shared with guests after they've made a reservation.</p>
            <LocationInputWithMap
              value={formData.address}
              onChange={(address) => setFormData(prev => ({ ...prev, address }))}
              placeholder="Enter your address"
            />
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Share some basics about your place</h1>
            <div className="space-y-8">
              {[
                { label: 'Guests', key: 'guests' },
                { label: 'Bedrooms', key: 'bedrooms' },
                { label: 'Bathrooms', key: 'bathrooms' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-6 border-b">
                  <span className="text-xl font-medium">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, [item.key]: Math.max(1, prev[item.key] - 1) }))}
                      className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900 disabled:opacity-30"
                      disabled={formData[item.key] <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{formData[item.key]}</span>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, [item.key]: prev[item.key] + 1 }))}
                      className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-4">Tell guests what your place has to offer</h1>
            <p className="text-gray-600 text-xl mb-12">You can add more amenities after you publish your listing.</p>
            <div className="grid grid-cols-2 gap-4">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenity.id)
                        ? prev.amenities.filter(a => a !== amenity.id)
                        : [...prev.amenities, amenity.id]
                    }));
                  }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    formData.amenities.includes(amenity.id)
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <div className="text-3xl mb-2">{amenity.icon}</div>
                  <div className="font-medium">{amenity.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Add some photos of your place</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-900 transition-all">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">Drag your photos here</p>
                <p className="text-gray-600">Choose at least 5 photos</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Now, let's give your place a title</h1>
            <textarea
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-6 text-2xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none resize-none"
              rows={3}
              placeholder="Modern 2-bedroom apartment in Lekki"
              maxLength={50}
            />
            <p className="text-gray-600 mt-2">{formData.title.length}/50</p>
          </div>
        );

      case 7:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Create your description</h1>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-6 text-xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none resize-none"
              rows={8}
              placeholder="Share what makes your place special..."
            />
          </div>
        );

      case 8:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Now, set your price</h1>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl">₦</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full pl-16 pr-6 py-6 text-4xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none"
                placeholder="0"
              />
            </div>
            <p className="text-gray-600 text-xl mt-4">per month</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-8">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 transition-all" style={{ width: `${(step / 8) * 100}%` }} />
            </div>
          </div>
          <button className="text-sm font-medium underline">Save & exit</button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-32">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className="px-6 py-3 font-medium underline hover:bg-gray-100 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => step < 8 ? setStep(step + 1) : handleSubmit()}
            className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover"
          >
            {step === 8 ? 'Publish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirbnbStyleRentListing;
