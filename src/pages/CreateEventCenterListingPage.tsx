import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Calendar, Users, MapPin, Clock, Music, Utensils, Car, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateEventCenterListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [venueType, setVenueType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venueSubType: '',
    capacity: '',
    indoorOutdoor: '',
    sqft: '',
    location: '',
    address: '',
    hourlyRate: '',
    dailyRate: '',
    weekendRate: '',
    securityDeposit: '',
    cleaningFee: '',
    // Event-specific fields
    minimumBooking: '',
    maximumBooking: '',
    setupTime: '',
    cleanupTime: '',
    cateringAllowed: '',
    alcoholAllowed: '',
    musicAllowed: '',
    decorationPolicy: '',
    parkingSpaces: '',
    nearbyHotels: '',
    accessibilityFeatures: '',
  });

  const venueTypes = [
    { id: 'hall', label: 'Event Hall', icon: Calendar, description: 'Indoor event halls and banquet rooms' },
    { id: 'outdoor', label: 'Outdoor Venue', icon: MapPin, description: 'Gardens, fields, and outdoor spaces' },
    { id: 'conference', label: 'Conference Center', icon: Users, description: 'Meeting rooms and conference facilities' },
    { id: 'wedding', label: 'Wedding Venue', icon: Calendar, description: 'Specialized wedding venues' },
  ];

  const venueSubTypes = {
    hall: ['Banquet Hall', 'Reception Hall', 'Community Hall', 'Church Hall', 'Hotel Ballroom', 'Convention Center'],
    outdoor: ['Garden Venue', 'Beach Venue', 'Park Pavilion', 'Rooftop Terrace', 'Courtyard', 'Open Field'],
    conference: ['Meeting Room', 'Conference Hall', 'Seminar Room', 'Training Center', 'Boardroom', 'Auditorium'],
    wedding: ['Wedding Chapel', 'Bridal Suite', 'Reception Venue', 'Ceremony Garden', 'Destination Venue']
  };

  const amenities = [
    { id: 'sound', label: 'Sound System', icon: Music },
    { id: 'lighting', label: 'Professional Lighting', icon: Calendar },
    { id: 'catering', label: 'Catering Kitchen', icon: Utensils },
    { id: 'parking', label: 'Parking Space', icon: Car },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'ac', label: 'Air Conditioning', icon: Clock },
    { id: 'stage', label: 'Stage/Platform', icon: Calendar },
    { id: 'tables', label: 'Tables & Chairs', icon: Users },
    { id: 'restrooms', label: 'Restroom Facilities', icon: MapPin },
    { id: 'wifi', label: 'WiFi Internet', icon: Clock },
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
    console.log('Event Center Data:', formData);
    console.log('Amenities:', selectedAmenities);
    alert('Event center listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Event Venue Type</h2>
              <p className="text-muted-foreground mb-4">What type of event venue are you listing?</p>
            </div>
            
            <div className="grid gap-4">
              {venueTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setVenueType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      venueType === type.id 
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
              <h2 className="text-xl font-bold mb-2">Venue Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your event venue</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Venue Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Elegant Wedding Hall in Victoria Island"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specific Venue Type</label>
                <select
                  value={formData.venueSubType}
                  onChange={(e) => handleInputChange('venueSubType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select venue type</option>
                  {venueType && venueSubTypes[venueType as keyof typeof venueSubTypes]?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Guest Capacity</label>
                  <select
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select capacity</option>
                    <option value="50">Up to 50 guests</option>
                    <option value="100">Up to 100 guests</option>
                    <option value="200">Up to 200 guests</option>
                    <option value="500">Up to 500 guests</option>
                    <option value="1000">Up to 1000 guests</option>
                    <option value="1000+">1000+ guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Indoor/Outdoor</label>
                  <select
                    value={formData.indoorOutdoor}
                    onChange={(e) => handleInputChange('indoorOutdoor', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select type</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="both">Indoor & Outdoor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe your event venue, what makes it special for events..."
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

              <div>
                <label className="block text-sm font-medium mb-2">Full Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="Enter complete venue address"
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
              <p className="text-muted-foreground mb-4">Upload venue photos and select amenities</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Venue Photos</label>
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
                  <p className="text-sm text-muted-foreground">Upload venue photos (Max 10)</p>
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
              <label className="block text-sm font-medium mb-2">Venue Amenities</label>
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
              <h2 className="text-xl font-bold mb-2">Pricing & Booking Policies</h2>
              <p className="text-muted-foreground mb-4">Set your venue rates and policies</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Hourly Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Daily Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="300000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weekend Rate (₦)</label>
                  <input
                    type="number"
                    value={formData.weekendRate}
                    onChange={(e) => handleInputChange('weekendRate', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="400000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Booking</label>
                  <select
                    value={formData.minimumBooking}
                    onChange={(e) => handleInputChange('minimumBooking', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select minimum</option>
                    <option value="2hours">2 Hours</option>
                    <option value="4hours">4 Hours</option>
                    <option value="6hours">6 Hours</option>
                    <option value="1day">1 Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Security Deposit (₦)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Catering Allowed?</label>
                  <select
                    value={formData.cateringAllowed}
                    onChange={(e) => handleInputChange('cateringAllowed', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="inhouse-only">In-house only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alcohol Allowed?</label>
                  <select
                    value={formData.alcoholAllowed}
                    onChange={(e) => handleInputChange('alcoholAllowed', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="license-required">License Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Decoration Policy</label>
                <textarea
                  value={formData.decorationPolicy}
                  onChange={(e) => handleInputChange('decorationPolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., No nails in walls, candles allowed, confetti not allowed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nearby Hotels & Accommodations</label>
                <textarea
                  value={formData.nearbyHotels}
                  onChange={(e) => handleInputChange('nearbyHotels', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="List nearby hotels for out-of-town guests..."
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
              <h1 className="text-xl font-bold">List Event Center</h1>
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
              disabled={currentStep === 1 && !venueType}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {currentStep === 4 ? 'Publish Event Center' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventCenterListingPage;