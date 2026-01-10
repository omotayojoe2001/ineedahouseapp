import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Store, ShoppingBag, Building, MapPin, Users, Clock, Shield, Car, Zap, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateShopListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [shopType, setShopType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shopSubType: '',
    sqft: '',
    frontage: '',
    location: '',
    address: '',
    monthlyRent: '',
    serviceCharge: '',
    securityDeposit: '',
    // Shop-specific fields
    businessType: '',
    targetCustomers: '',
    footTraffic: '',
    operatingHours: '',
    loadingAccess: '',
    storageSpace: '',
    displayWindows: '',
    floorLevel: '',
    neighboringBusinesses: '',
    publicTransport: '',
    marketDays: '',
    competitorAnalysis: '',
  });

  const shopTypes = [
    { id: 'retail', label: 'Retail Shop', icon: Store, description: 'Individual shops and stores' },
    { id: 'mall', label: 'Mall Space', icon: Building, description: 'Shops inside shopping malls' },
    { id: 'market', label: 'Market Stall', icon: ShoppingBag, description: 'Market stalls and kiosks' },
    { id: 'plaza', label: 'Plaza Shop', icon: Building, description: 'Shops in commercial plazas' },
  ];

  const shopSubTypes = {
    retail: ['Ground Floor Shop', 'Corner Shop', 'Strip Mall Unit', 'Standalone Store', 'Roadside Shop'],
    mall: ['Mall Kiosk', 'Anchor Store', 'Inline Store', 'Food Court Space', 'Department Store'],
    market: ['Market Stall', 'Container Shop', 'Open Stall', 'Covered Stall', 'Lock-up Shop'],
    plaza: ['Plaza Unit', 'Showroom', 'Office-Retail Combo', 'Upper Floor Shop', 'Basement Shop']
  };

  const shopFeatures = [
    { id: 'parking', label: 'Customer Parking', icon: Car },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'power', label: 'Reliable Power Supply', icon: Zap },
    { id: 'water', label: 'Water Supply', icon: Droplets },
    { id: 'loading', label: 'Loading Bay', icon: Building },
    { id: 'storage', label: 'Storage Room', icon: Store },
    { id: 'display', label: 'Display Windows', icon: ShoppingBag },
    { id: 'signage', label: 'Signage Space', icon: MapPin },
    { id: 'restroom', label: 'Customer Restroom', icon: Users },
    { id: 'ac', label: 'Air Conditioning', icon: Clock },
  ];

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

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Shop Listing Data:', formData);
    console.log('Features:', selectedFeatures);
    alert('Shop listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Shop/Store Type</h2>
              <p className="text-muted-foreground mb-4">What type of retail space are you listing?</p>
            </div>
            
            <div className="grid gap-4">
              {shopTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setShopType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      shopType === type.id 
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
              <h2 className="text-xl font-bold mb-2">Shop Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your retail space</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Shop Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Prime Retail Shop in Ikeja Shopping Plaza"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specific Shop Type</label>
                <select
                  value={formData.shopSubType}
                  onChange={(e) => handleInputChange('shopSubType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select shop type</option>
                  {shopType && shopSubTypes[shopType as keyof typeof shopSubTypes]?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Floor Area (sqft)</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange('sqft', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Frontage (ft)</label>
                  <input
                    type="number"
                    value={formData.frontage}
                    onChange={(e) => handleInputChange('frontage', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Suitable Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select business type</option>
                    <option value="fashion">Fashion/Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="food">Food/Restaurant</option>
                    <option value="pharmacy">Pharmacy/Medical</option>
                    <option value="beauty">Beauty/Salon</option>
                    <option value="general">General Merchandise</option>
                    <option value="services">Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Floor Level</label>
                  <select
                    value={formData.floorLevel}
                    onChange={(e) => handleInputChange('floorLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select floor</option>
                    <option value="ground">Ground Floor</option>
                    <option value="mezzanine">Mezzanine</option>
                    <option value="first">First Floor</option>
                    <option value="upper">Upper Floors</option>
                    <option value="basement">Basement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe the retail space, location advantages, foot traffic..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Ikeja City Mall, Lagos"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Photos & Features</h2>
              <p className="text-muted-foreground mb-4">Upload shop photos and select features</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shop Photos</label>
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
                  <p className="text-sm text-muted-foreground">Upload shop photos (Max 10)</p>
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
              <label className="block text-sm font-medium mb-2">Shop Features</label>
              <div className="grid grid-cols-2 gap-3">
                {shopFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent size={18} className="text-primary" />
                        <span className="text-sm">{feature.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Foot Traffic Level</label>
                <select
                  value={formData.footTraffic}
                  onChange={(e) => handleInputChange('footTraffic', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select traffic level</option>
                  <option value="very-high">Very High</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Operating Hours</label>
                <select
                  value={formData.operatingHours}
                  onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select hours</option>
                  <option value="24-7">24/7</option>
                  <option value="extended">Extended Hours (6AM-10PM)</option>
                  <option value="business">Business Hours (8AM-6PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Rental Terms & Business Environment</h2>
              <p className="text-muted-foreground mb-4">Set rental terms and business details</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent (₦)</label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="200000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Charge (₦)</label>
                  <input
                    type="number"
                    value={formData.serviceCharge}
                    onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Security Deposit (₦)</label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="400000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Customers</label>
                <textarea
                  value={formData.targetCustomers}
                  onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., Office workers, Students, Families, Tourists..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Neighboring Businesses</label>
                <textarea
                  value={formData.neighboringBusinesses}
                  onChange={(e) => handleInputChange('neighboringBusinesses', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., Banks, Restaurants, Supermarket, Pharmacy..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Public Transport Access</label>
                  <select
                    value={formData.publicTransport}
                    onChange={(e) => handleInputChange('publicTransport', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select access</option>
                    <option value="excellent">Excellent (BRT/Metro nearby)</option>
                    <option value="good">Good (Bus stops nearby)</option>
                    <option value="fair">Fair (Walking distance)</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Market Days (if applicable)</label>
                  <input
                    type="text"
                    value={formData.marketDays}
                    onChange={(e) => handleInputChange('marketDays', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="e.g., Monday, Wednesday, Friday"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Competition Analysis</label>
                <textarea
                  value={formData.competitorAnalysis}
                  onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="Describe similar businesses in the area and competitive advantages..."
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
              <h1 className="text-xl font-bold">List Shop/Store</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
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
              disabled={currentStep === 1 && !shopType}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {currentStep === 4 ? 'Publish Shop Listing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateShopListingPage;