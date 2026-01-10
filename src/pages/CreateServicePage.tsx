import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Upload, X, Car, Paintbrush, Package, Wrench, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type') || '';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: serviceType,
    location: '',
    address: '',
    pricing: '',
    availability: '',
    experience: '',
    certifications: '',
    contactPhone: '',
    contactEmail: '',
  });

  const serviceTypes = {
    relocation: {
      title: 'Car Delivery & Relocation',
      icon: Car,
      fields: ['Vehicle Types', 'Coverage Areas', 'Insurance']
    },
    painting: {
      title: 'Painting Services', 
      icon: Paintbrush,
      fields: ['Interior/Exterior', 'Paint Types', 'Room Sizes']
    },
    furniture: {
      title: 'Furniture Services',
      icon: Package, 
      fields: ['Assembly Types', 'Delivery Areas', 'Tools Provided']
    },
    other: {
      title: 'Other Services',
      icon: Wrench,
      fields: ['Service Category', 'Specializations', 'Equipment']
    }
  };

  const currentService = serviceTypes[serviceType as keyof typeof serviceTypes];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Service Data:', formData);
    console.log('Images:', images);
    alert('Service listing created successfully!');
    navigate('/my-listings');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Service Details</h2>
              <p className="text-muted-foreground mb-4">Tell us about your {currentService?.title.toLowerCase()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder={`e.g., Professional ${currentService?.title}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe your service, experience, and what makes you unique..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select experience</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pricing (₦)</label>
                  <input
                    type="text"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="e.g., From ₦5,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service Areas</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Lagos Island, Victoria Island, Lekki"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <textarea
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="e.g., Monday-Friday 8AM-6PM, Weekends available"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Photos & Portfolio</h2>
              <p className="text-muted-foreground mb-4">Upload photos of your work and certifications</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Service Photos</label>
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
                  <p className="text-sm text-muted-foreground">Upload photos of your work (Max 10)</p>
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
              <label className="block text-sm font-medium mb-2">Certifications & Licenses</label>
              <textarea
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg h-20"
                placeholder="List any relevant certifications, licenses, or training..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Contact Information</h2>
              <p className="text-muted-foreground mb-4">How can customers reach you?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-20"
                  placeholder="Enter your business address or service area"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentService) {
    return (
      <Layout activeTab="upload">
        <div className="bg-background min-h-screen desktop-nav-spacing flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">Service Type Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested service type is not available.</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
              <h1 className="text-xl font-bold">Create {currentService.title}</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 3</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
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
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              {currentStep === 3 ? 'Publish Service' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateServicePage;