import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, MapPin, Car, Waves, Dumbbell, Shield, ChefHat, Wifi, Snowflake, Droplets, Home, Building, Store, Calendar, Users, Zap, Tv, Coffee, Bath, Bed } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  
  const [currentStep, setCurrentStep] = useState(typeFromUrl ? 2 : 1);
  const [listingType, setListingType] = useState(typeFromUrl || '');
  const [images, setImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    location: '',
    address: '',
    rentType: 'monthly',
    monthlyRent: '',
    serviceCharge: '',
    securityDeposit: '',
    utilityBills: '',
    cleaningFee: '',
    latitude: '',
    longitude: '',
    // Additional property details
    kitchenAvailable: '',
    totalRooms: '',
    hasBalcony: '',
    // Questions & Answers
    allowsPets: '',
    nearBusStop: '',
    busStopDistance: '',
    furnished: '',
    parkingSpaces: '',
    floorLevel: '',
    buildingAge: '',
    nearbyLandmarks: '',
  });

  // Map URL types to display types
  const getListingTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'rent': 'house',
      'sale': 'house', 
      'land': 'commercial',
      'shortlet': 'shortlet',
      'commercial': 'commercial',
      'event': 'event'
    };
    return typeMap[type] || type;
  };

  useEffect(() => {
    if (typeFromUrl) {
      setListingType(getListingTypeDisplay(typeFromUrl));
    }
  }, [typeFromUrl]);

  const listingTypes = [
    { id: 'house', label: 'House/Apartment', icon: Home, description: 'Residential properties for rent or sale' },
    { id: 'commercial', label: 'Commercial Space', icon: Building, description: 'Offices, warehouses, commercial buildings' },
    { id: 'shop', label: 'Shop/Store', icon: Store, description: 'Retail spaces and shops' },
    { id: 'event', label: 'Event Center', icon: Calendar, description: 'Event halls and venues' },
    { id: 'shortlet', label: 'Shortlet', icon: Users, description: 'Short-term rental properties' },
  ];

  const propertyTypes = {
    house: ['Self-Contained', 'Mini Flat', '1 Bedroom Flat', '2 Bedroom Flat', '3 Bedroom Flat', '4+ Bedroom Flat', 'Duplex', 'Bungalow', 'Detached House', 'Semi-Detached House'],
    apartment: ['Studio Apartment', '1 Bedroom Apartment', '2 Bedroom Apartment', '3 Bedroom Apartment', '4+ Bedroom Apartment', 'Penthouse', 'Serviced Apartment'],
    commercial: ['Office Space', 'Warehouse', 'Factory', 'Co-working Space', 'Medical Center', 'Restaurant Space'],
    shop: ['Shop/Store', 'Supermarket', 'Mall Space', 'Kiosk', 'Market Stall'],
    shortlet: ['Furnished Apartment', 'Hotel Room', 'Guest House', 'Serviced Apartment', 'Vacation Rental']
  };

  const getAmenitiesForType = (type: string) => {
    const baseAmenities = [
      { id: 'parking', label: 'Parking Space', icon: Car },
      { id: 'security', label: '24/7 Security', icon: Shield },
      { id: 'water', label: 'Water Supply', icon: Droplets },
      { id: 'power', label: 'Backup Generator', icon: Zap },
      { id: 'balcony', label: 'Balcony/Terrace', icon: Home },
    ];
    
    if (type === 'shortlet') {
      return [
        ...baseAmenities,
        { id: 'kitchen', label: 'Fully Equipped Kitchen', icon: ChefHat },
        { id: 'wifi', label: 'WiFi Internet', icon: Wifi },
        { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
        { id: 'tv', label: 'Cable TV', icon: Tv },
        { id: 'laundry', label: 'Laundry Service', icon: Coffee },
        { id: 'pool', label: 'Swimming Pool', icon: Waves },
        { id: 'gym', label: 'Gym/Fitness Center', icon: Dumbbell },
      ];
    }
    
    return baseAmenities;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form Data:', formData);
    console.log('Images:', images);
    console.log('Amenities:', selectedAmenities);
    alert('Listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">What are you listing?</h2>
              <p className="text-muted-foreground mb-4">Choose the type of property you want to list</p>
            </div>
            
            <div className="grid gap-4">
              {listingTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setListingType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      listingType === type.id 
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
              <h2 className="text-xl font-bold mb-2">Property Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your property</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Modern 3-Bedroom Apartment in Lekki"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select property type</option>
                  {listingType && propertyTypes[listingType as keyof typeof propertyTypes]?.map(type => (
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Rooms</label>
                  <select
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange('totalRooms', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select total rooms</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Size (sqft)</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange('sqft', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Kitchen Available?</label>
                  <select
                    value={formData.kitchenAvailable}
                    onChange={(e) => handleInputChange('kitchenAvailable', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Has Balcony?</label>
                  <select
                    value={formData.hasBalcony}
                    onChange={(e) => handleInputChange('hasBalcony', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe your property..."
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

              <div>
                <label className="block text-sm font-medium mb-2">Full Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="Enter complete address"
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

            {/* Photo Upload */}
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
                  <p className="text-sm text-muted-foreground">Click to upload photos (Max 10)</p>
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

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium mb-2">Amenities & Features</label>
              <div className="grid grid-cols-2 gap-3">
                {getAmenitiesForType(listingType).map((amenity) => {
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
              <h2 className="text-xl font-bold mb-2">Pricing & Availability</h2>
              <p className="text-muted-foreground mb-4">Set your pricing details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rent Type</label>
                <select
                  value={formData.rentType}
                  onChange={(e) => handleInputChange('rentType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="monthly">Monthly Rent</option>
                  <option value="weekly">Weekly Rent</option>
                  <option value="annual">Annual Rent</option>
                  <option value="daily">Daily Rent (Shortlet)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.rentType === 'monthly' ? 'Monthly' : 
                   formData.rentType === 'weekly' ? 'Weekly' :
                   formData.rentType === 'annual' ? 'Annual' : 'Daily'} Rent (₦)
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="150000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Charge (₦)</label>
                  <input
                    type="number"
                    value={formData.serviceCharge}
                    onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="25000"
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
                  <label className="block text-sm font-medium mb-2">Utility Bills (₦)</label>
                  <input
                    type="number"
                    value={formData.utilityBills}
                    onChange={(e) => handleInputChange('utilityBills', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cleaning Fee (₦)</label>
                  <input
                    type="number"
                    value={formData.cleaningFee}
                    onChange={(e) => handleInputChange('cleaningFee', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Map Location */}
              {/* Property Questions */}
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-semibold text-lg">Property Questions</h3>
                
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
                    <label className="block text-sm font-medium mb-2">Near Bus Stop?</label>
                    <select
                      value={formData.nearBusStop}
                      onChange={(e) => handleInputChange('nearBusStop', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {formData.nearBusStop === 'yes' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Distance to Bus Stop (minutes)</label>
                    <select
                      value={formData.busStopDistance}
                      onChange={(e) => handleInputChange('busStopDistance', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select distance</option>
                      <option value="1-2">1-2 minutes</option>
                      <option value="3-5">3-5 minutes</option>
                      <option value="6-10">6-10 minutes</option>
                      <option value="11-15">11-15 minutes</option>
                      <option value="16-20">16-20 minutes</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Parking Spaces</label>
                    <select
                      value={formData.parkingSpaces}
                      onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select spaces</option>
                      <option value="0">No Parking</option>
                      <option value="1">1 Space</option>
                      <option value="2">2 Spaces</option>
                      <option value="3">3+ Spaces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Floor Level</label>
                    <select
                      value={formData.floorLevel}
                      onChange={(e) => handleInputChange('floorLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select floor</option>
                      <option value="ground">Ground Floor</option>
                      <option value="1st">1st Floor</option>
                      <option value="2nd">2nd Floor</option>
                      <option value="3rd">3rd Floor</option>
                      <option value="4th+">4th Floor & Above</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Building Age</label>
                    <select
                      value={formData.buildingAge}
                      onChange={(e) => handleInputChange('buildingAge', e.target.value)}
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nearby Landmarks</label>
                  <textarea
                    value={formData.nearbyLandmarks}
                    onChange={(e) => handleInputChange('nearbyLandmarks', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg h-20"
                    placeholder="e.g., Close to Shoprite, 5 minutes to Lekki Toll Gate, Near UNILAG..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Map Location (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="Longitude"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Add coordinates to show exact location on map
                </p>
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
        {/* Header */}
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Create New Listing</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 py-6 pb-32">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
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
              disabled={currentStep === 1 && !listingType}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Publish Listing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateListingPage;