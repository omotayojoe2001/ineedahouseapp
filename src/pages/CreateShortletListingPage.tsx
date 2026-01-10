import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Home, Building, Car, Waves, Dumbbell, Shield, ChefHat, Wifi, Snowflake, Droplets, Zap, Tv, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateShortletListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertySubType: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    sqft: '',
    location: '',
    address: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    cleaningFee: '',
    securityDeposit: '',
    // Shortlet-specific fields
    minimumStay: '',
    maximumStay: '',
    checkInTime: '',
    checkOutTime: '',
    houseRules: '',
    cancellationPolicy: '',
    instantBooking: '',
    nearbyAttractions: '',
  });

  const propertyTypes = [
    { id: 'apartment', label: 'Apartment/Flat', icon: Home, description: 'Furnished apartments and flats' },
    { id: 'house', label: 'Entire House', icon: Building, description: 'Complete houses and villas' },
    { id: 'studio', label: 'Studio', icon: Home, description: 'Studio apartments' },
  ];

  const propertySubTypes = {
    apartment: ['1 Bedroom Apartment', '2 Bedroom Apartment', '3 Bedroom Apartment', '4+ Bedroom Apartment', 'Penthouse', 'Serviced Apartment'],
    house: ['Duplex', 'Bungalow', 'Villa', 'Townhouse', 'Detached House'],
    studio: ['Studio Apartment', 'Mini Studio', 'Loft Studio']
  };

  const amenities = [
    { id: 'wifi', label: 'WiFi Internet', icon: Wifi },
    { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
    { id: 'kitchen', label: 'Fully Equipped Kitchen', icon: ChefHat },
    { id: 'tv', label: 'Cable TV', icon: Tv },
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'gym', label: 'Gym/Fitness Center', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'power', label: 'Backup Generator', icon: Zap },
    { id: 'laundry', label: 'Laundry Service', icon: Coffee },
    { id: 'water', label: 'Hot Water', icon: Droplets },
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

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Shortlet Listing Data:', formData);
    console.log('Amenities:', selectedAmenities);
    alert('Shortlet listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Shortlet Property Type</h2>
              <p className="text-muted-foreground mb-4">What type of shortlet are you listing?</p>
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
              <h2 className="text-xl font-bold mb-2">Shortlet Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your shortlet property</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Luxury 2-Bedroom Shortlet in Lekki with Pool"
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Beds</option>
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
                    <option value="">Baths</option>
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Guests</label>
                  <select
                    value={formData.maxGuests}
                    onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Guests</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
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
                  placeholder="Describe your shortlet property, what makes it special..."
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
              <h2 className="text-xl font-bold mb-2">Photos & Amenities</h2>
              <p className="text-muted-foreground mb-4">Upload photos and select amenities</p>
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
              <label className="block text-sm font-medium mb-2">Amenities & Features</label>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedAmenities.includes(amenity.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent size={18} className="text-primary" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Pricing & Booking Rules</h2>
              <p className="text-muted-foreground mb-4">Set your rates and booking policies</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Daily Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.weeklyRate}
                    onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.monthlyRate}
                    onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Stay</label>
                  <select
                    value={formData.minimumStay}
                    onChange={(e) => handleInputChange('minimumStay', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select minimum</option>
                    <option value="1">1 Night</option>
                    <option value="2">2 Nights</option>
                    <option value="3">3 Nights</option>
                    <option value="7">1 Week</option>
                    <option value="30">1 Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maximum Stay</label>
                  <select
                    value={formData.maximumStay}
                    onChange={(e) => handleInputChange('maximumStay', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select maximum</option>
                    <option value="7">1 Week</option>
                    <option value="30">1 Month</option>
                    <option value="90">3 Months</option>
                    <option value="365">1 Year</option>
                    <option value="unlimited">No Limit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Time</label>
                  <select
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select time</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Time</label>
                  <select
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select time</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">House Rules</label>
                <textarea
                  value={formData.houseRules}
                  onChange={(e) => handleInputChange('houseRules', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., No smoking, No parties, No pets..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nearby Attractions</label>
                <textarea
                  value={formData.nearbyAttractions}
                  onChange={(e) => handleInputChange('nearbyAttractions', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., 5 minutes to beach, Close to shopping mall..."
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
              <h1 className="text-xl font-bold">Create Shortlet Listing</h1>
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
              {currentStep === 4 ? 'Publish Shortlet' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateShortletListingPage;