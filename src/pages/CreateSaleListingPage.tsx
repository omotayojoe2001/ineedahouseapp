import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Home, Building, Store, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CreateSaleListingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(!!editId);
  
  useEffect(() => {
    if (editId) {
      const fetchSaleProperty = async () => {
        try {
          const { data, error } = await supabase
            .from('sale_properties')
            .select('*')
            .eq('id', editId)
            .single();

          if (error) throw error;

          // Convert existing images from base64 to File objects for preview
          const existingImages: File[] = [];
          if (data.images && Array.isArray(data.images)) {
            for (let i = 0; i < data.images.length; i++) {
              try {
                const base64 = data.images[i];
                const response = await fetch(base64);
                const blob = await response.blob();
                const file = new File([blob], `existing-image-${i}.jpg`, { type: 'image/jpeg' });
                existingImages.push(file);
              } catch (err) {
                console.error('Error converting image:', err);
              }
            }
          }
          setImages(existingImages);

          // Pre-fill form with existing data
          setFormData({
            title: data.title || '',
            description: data.description || '',
            propertySubType: data.property_sub_type || '',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            totalRooms: '',
            sqft: '',
            location: data.location || '',
            address: data.address || '',
            salePrice: data.sale_price?.toString() || '',
            priceNegotiable: data.price_negotiable ? 'yes' : 'no',
            propertyAge: data.property_age || '',
            titleDocument: data.title_document || '',
            landSize: data.land_size?.toString() || '',
            propertyCondition: data.property_condition || '',
            reasonForSelling: data.reason_for_selling || '',
            occupancyStatus: data.occupancy_status || '',
            nearbyLandmarks: data.nearby_landmarks || '',
          });

          // Set property type
          setPropertyType(data.property_type || '');

        } catch (error) {
          console.error('Error fetching sale property:', error);
          toast({ title: 'Error', description: 'Failed to load property data', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };

      fetchSaleProperty();
    }
  }, [editId, toast]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertySubType: '',
    bedrooms: '',
    bathrooms: '',
    totalRooms: '',
    sqft: '',
    location: '',
    address: '',
    salePrice: '',
    priceNegotiable: '',
    // Sale-specific fields
    propertyAge: '',
    titleDocument: '',
    landSize: '',
    propertyCondition: '',
    reasonForSelling: '',
    occupancyStatus: '',
    nearbyLandmarks: '',
  });

  const propertyTypes = [
    { id: 'house', label: 'House/Apartment', icon: Home, description: 'Houses, flats, and residential properties' },
    { id: 'commercial', label: 'Commercial Property', icon: Building, description: 'Offices, warehouses, commercial buildings' },
    { id: 'land', label: 'Land/Plot', icon: Store, description: 'Residential and commercial land' },
  ];

  const propertySubTypes = {
    house: ['Detached House', 'Semi-Detached House', 'Duplex', 'Bungalow', 'Apartment', 'Penthouse', 'Townhouse'],
    commercial: ['Office Building', 'Warehouse', 'Factory', 'Shopping Complex', 'Hotel', 'Hospital'],
    land: ['Residential Land', 'Commercial Land', 'Industrial Land', 'Agricultural Land', 'Mixed Use Land']
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in to create listings', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Convert images to base64
      const imagePromises = images.map(async (img) => {
        return new Promise<string>((resolve, reject) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          
          image.onload = () => {
            const maxWidth = 800;
            const ratio = Math.min(maxWidth / image.width, maxWidth / image.height);
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedBase64);
          };
          
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = URL.createObjectURL(img);
        });
      });

      const processedImages = await Promise.all(imagePromises);

      const salePropertyData = {
        title: formData.title,
        description: formData.description,
        property_type: propertyType,
        property_sub_type: formData.propertySubType,
        location: formData.location,
        address: formData.address,
        bedrooms: parseInt(formData.bedrooms) || null,
        bathrooms: parseInt(formData.bathrooms) || null,
        land_size: parseFloat(formData.landSize) || null,
        sale_price: parseFloat(formData.salePrice) || 0,
        price_negotiable: formData.priceNegotiable === 'yes',
        property_age: formData.propertyAge,
        property_condition: formData.propertyCondition,
        occupancy_status: formData.occupancyStatus,
        reason_for_selling: formData.reasonForSelling,
        title_document: formData.titleDocument,
        nearby_landmarks: formData.nearbyLandmarks,
        images: processedImages,
        user_id: user.id,
        status: 'active',
      };

      if (editId) {
        const { error } = await supabase
          .from('sale_properties')
          .update(salePropertyData)
          .eq('id', editId);

        if (error) throw error;
        toast({ title: 'Success', description: 'Sale listing updated successfully!' });
      } else {
        const { error } = await supabase
          .from('sale_properties')
          .insert([salePropertyData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Sale listing created successfully!' });
      }
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating sale listing:', error);
      toast({ title: 'Error', description: 'Failed to create listing. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Property Type for Sale</h2>
              <p className="text-muted-foreground mb-4">What type of property are you selling?</p>
            </div>
            
            <div className="grid gap-4">
              {propertyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setPropertyType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      propertyType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent size={24} className="text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{type.label}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Property Details for Sale</h2>
              <p className="text-muted-foreground mb-4">Tell us about the property you're selling</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Beautiful 4-Bedroom Duplex for Sale in Victoria Island"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specific Property Type</label>
                <select
                  value={formData.propertySubType}
                  onChange={(e) => handleInputChange('propertySubType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select specific type</option>
                  {propertyType && propertySubTypes[propertyType as keyof typeof propertySubTypes]?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {propertyType !== 'land' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select bedrooms</option>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select bathrooms</option>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Age</label>
                  <select
                    value={formData.propertyAge}
                    onChange={(e) => handleInputChange('propertyAge', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select age</option>
                    <option value="new">Brand New</option>
                    <option value="1-2">1-2 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="6-10">6-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Land Size (sqm)</label>
                  <input
                    type="number"
                    value={formData.landSize}
                    onChange={(e) => handleInputChange('landSize', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe the property you're selling..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Victoria Island, Lagos"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Photos & Documentation</h2>
              <p className="text-muted-foreground mb-4">Upload photos and property documents</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Photos</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload photos (Max 10)</p>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title Document</label>
              <select
                value={formData.titleDocument}
                onChange={(e) => handleInputChange('titleDocument', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="">Select document type</option>
                <option value="certificate-of-occupancy">Certificate of Occupancy (C of O)</option>
                <option value="deed-of-assignment">Deed of Assignment</option>
                <option value="governors-consent">Governor's Consent</option>
                <option value="survey-plan">Survey Plan</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Sale Price & Details</h2>
              <p className="text-muted-foreground mb-4">Set your sale price and additional details</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Sale Price (₦)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="50000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Negotiable?</label>
                  <select
                    value={formData.priceNegotiable}
                    onChange={(e) => handleInputChange('priceNegotiable', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Condition</label>
                  <select
                    value={formData.propertyCondition}
                    onChange={(e) => handleInputChange('propertyCondition', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs-renovation">Needs Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Occupancy Status</label>
                  <select
                    value={formData.occupancyStatus}
                    onChange={(e) => handleInputChange('occupancyStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select status</option>
                    <option value="vacant">Vacant</option>
                    <option value="owner-occupied">Owner Occupied</option>
                    <option value="tenant-occupied">Tenant Occupied</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason for Selling</label>
                <select
                  value={formData.reasonForSelling}
                  onChange={(e) => handleInputChange('reasonForSelling', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select reason</option>
                  <option value="relocation">Relocation</option>
                  <option value="upgrade">Upgrading to larger property</option>
                  <option value="investment">Investment liquidation</option>
                  <option value="financial">Financial reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nearby Landmarks</label>
                <textarea
                  value={formData.nearbyLandmarks}
                  onChange={(e) => handleInputChange('nearbyLandmarks', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., Close to Shoprite, 5 minutes to Lekki Toll Gate..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeTab="upload">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{editId ? 'Edit Property for Sale' : 'List Property for Sale'}</h1>
              <p className="text-sm text-muted-foreground">{editId ? 'Edit your sale listing' : `Step ${currentStep} of 4`}</p>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-6 pb-32">
          {renderStep()}
        </div>

        <div className="fixed bottom-20 lg:bottom-6 left-0 right-0 px-4 bg-background border-t border-border py-4 z-50">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 border border-border rounded-lg font-medium hover:bg-muted"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={(currentStep === 1 && !propertyType) || loading}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : editId ? 'Update Sale Listing' : currentStep === 4 ? 'Publish Sale Listing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSaleListingPage;