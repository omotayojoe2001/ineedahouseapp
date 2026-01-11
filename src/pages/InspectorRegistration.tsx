import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, MapPin, Star, Shield, Camera, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import InspectorIntroCarousel from '../components/InspectorIntroCarousel';

const InspectorRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    experience: '',
    specialization: [],
    certifications: '',
    fee: '',
    bio: '',
    profilePhoto: null,
    idDocument: null,
    certificationDocs: []
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setFormData(prev => ({
            ...prev,
            fullName: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || '',
            phone: data.phone || '',
            email: user.email || '',
            location: data.location || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (!showIntro) {
      fetchUserProfile();
    }
  }, [user, showIntro]);

  const [certificates, setCertificates] = useState([]);

  const addCertificate = () => {
    setCertificates([...certificates, { id: Date.now(), name: '', description: '', file: null }]);
  };

  const updateCertificate = (id, field, value) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertificate = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const specializations = [
    'Residential Properties',
    'Commercial Properties',
    'Land/Plot Inspection',
    'New Construction',
    'Renovation Assessment',
    'Structural Analysis'
  ];

  const handleSpecializationToggle = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Inspector registration:', formData);
    navigate('/inspector-dashboard');
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleCertificateFileUpload = (certId, file) => {
    if (file) {
      updateCertificate(certId, 'file', file);
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50">
        <InspectorIntroCarousel onComplete={handleIntroComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Become an Inspector</h1>
            <p className="text-blue-100 text-sm">Join our network of trusted property inspectors</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < currentStep ? 'bg-white' : 'bg-blue-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Primary Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Lagos, Abuja, Port Harcourt..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 5 years"
                />
              </div>

              <div>
                <Label>Profile Photo *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  {formData.profilePhoto ? (
                    <div className="space-y-2">
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Profile preview" 
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                      />
                      <p className="text-sm font-medium">{formData.profilePhoto.name}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFormData(prev => ({ ...prev, profilePhoto: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Upload your profile photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
                        className="hidden"
                        id="profilePhoto"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('profilePhoto').click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Specialization *</Label>
                <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
                <div className="grid grid-cols-2 gap-2">
                  {specializations.map((spec) => (
                    <div
                      key={spec}
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.specialization.includes(spec)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                    >
                      <p className="text-sm font-medium">{spec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="fee">Inspection Fee Range *</Label>
                <Input
                  id="fee"
                  value={formData.fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                  placeholder="₦5,000 - ₦15,000"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell clients about your experience and expertise..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verification Documents */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Government ID *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  {formData.idDocument ? (
                    <div className="space-y-2">
                      <Shield className="h-8 w-8 mx-auto text-green-600" />
                      <p className="text-sm font-medium">{formData.idDocument.name}</p>
                      <p className="text-xs text-muted-foreground">{(formData.idDocument.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFormData(prev => ({ ...prev, idDocument: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Upload valid government ID</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('idDocument', e.target.files[0])}
                        className="hidden"
                        id="idDocument"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('idDocument').click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Professional Certificates</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addCertificate}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Certificate
                  </Button>
                </div>
                
                {certificates.length === 0 ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">No certificates added yet</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addCertificate}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <Card key={cert.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Certificate {certificates.indexOf(cert) + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCertificate(cert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label>Certificate Name *</Label>
                            <Input
                              value={cert.name}
                              onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                              placeholder="e.g., Real Estate License, Engineering Certificate"
                            />
                          </div>
                          
                          <div>
                            <Label>What does this certificate cover? *</Label>
                            <Textarea
                              value={cert.description}
                              onChange={(e) => updateCertificate(cert.id, 'description', e.target.value)}
                              placeholder="Describe what this certificate qualifies you for..."
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <Label>Upload Certificate *</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                              {cert.file ? (
                                <div className="space-y-2">
                                  <Upload className="h-6 w-6 mx-auto text-green-600" />
                                  <p className="text-sm font-medium">{cert.file.name}</p>
                                  <p className="text-xs text-muted-foreground">{(cert.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateCertificate(cert.id, 'file', null)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mb-2">Choose certificate file</p>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleCertificateFileUpload(cert.id, e.target.files[0])}
                                    className="hidden"
                                    id={`certificate-${cert.id}`}
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => document.getElementById(`certificate-${cert.id}`).click()}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Verification Process</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your documents will be reviewed within 24-48 hours</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Start receiving inspection requests immediately after approval</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectorRegistration;