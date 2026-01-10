import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Home, Building, Store, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateRentListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  
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
    monthlyRent: '',
    serviceCharge: '',
    securityDeposit: '',
    utilityBills: '',
    // Rent-specific fields
    leaseDuration: '',
    availableFrom: '',
    allowsPets: '',
    furnished: '',
    nearBusStop: '',
    busStopDistance: '',
    parkingSpaces: '',
    floorLevel: '',
    buildingAge: '',
    nearbyLandmarks: '',
  });

  const propertyTypes = [
    { id: 'house', label: 'House/Apartment', icon: Home, description: 'Houses, flats, and residential properties' },
    { id: 'commercial', label: 'Commercial Space', icon: Building, description: 'Offices, warehouses, commercial buildings' },
    { id: 'shop', label: 'Shop/Store', icon: Store, description: 'Retail spaces and shops' },
    { id: 'event', label: 'Event Center', icon: Calendar, description: 'Event halls and venues' },
  ];

  const propertySubTypes = {
    house: ['Self-Contained', 'Mini Flat', '1 Bedroom Flat', '2 Bedroom Flat', '3 Bedroom Flat', '4+ Bedroom Flat', 'Duplex', 'Bungalow'],
    commercial: ['Office Space', 'Warehouse', 'Factory', 'Co-working Space', 'Medical Center'],
    shop: ['Shop/Store', 'Supermarket', 'Mall Space', 'Kiosk', 'Market Stall'],
    event: ['Event Hall', 'Conference Center', 'Wedding Venue', 'Party Hall']
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

  const handleSubmit = () => {
    console.log('Rent Listing Data:', formData);
    alert('Rent listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Property Type for Rent</h2>
              <p className="text-muted-foreground mb-4">What type of property are you renting out?</p>
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
              <h2 className="text-xl font-bold mb-2">Rental Property Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your rental property</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Modern 3-Bedroom Apartment for Rent in Lekki"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select bedrooms</option>
                    {[1,2,3,4,5,6].map(num => (
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
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe your rental property..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Lekki Phase 1, Lagos"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Photos & Property Features</h2>
              <p className="text-muted-foreground mb-4">Upload photos of your rental property</p>
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Rental Terms & Pricing</h2>
              <p className="text-muted-foreground mb-4">Set your rental terms and pricing</p>
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
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Security Deposit (₦)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="300000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Lease Duration</label>
                  <select
                    value={formData.leaseDuration}
                    onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select duration</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available From</label>
                  <input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Allows Pets?</label>
                  <select
                    value={formData.allowsPets}
                    onChange={(e) => handleInputChange('allowsPets', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Furnished?</label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => handleInputChange('furnished', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="fully">Fully Furnished</option>
                    <option value="semi">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
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
              <h1 className="text-xl font-bold">List Property for Rent</h1>
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
              disabled={currentStep === 1 && !propertyType}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {currentStep === 4 ? 'Publish Rental' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRentListingPage;