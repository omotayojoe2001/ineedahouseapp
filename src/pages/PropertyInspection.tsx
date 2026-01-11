import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Shield, MessageCircle, Phone, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useParams } from 'react-router-dom';
import InspectionBookingModal from '../components/InspectionBookingModal';

const PropertyInspection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const property = {
    title: 'Modern 3-Bedroom Apartment',
    location: 'Lekki Phase 1, Lagos, Nigeria'
  };

  const inspectors = [
    {
      id: 1,
      name: 'Adebayo Ogundimu',
      rating: 4.9,
      reviews: 127,
      experience: '8 years',
      location: 'Lekki, Lagos',
      fee: '₦8,000',
      specialties: ['Residential', 'Commercial'],
      verified: true,
      responseTime: '2 hours',
      completedInspections: 340,
      distance: '2.5 km away'
    },
    {
      id: 2,
      name: 'Fatima Abdullahi',
      rating: 4.8,
      reviews: 89,
      experience: '5 years',
      location: 'Victoria Island, Lagos',
      fee: '₦12,000',
      specialties: ['Luxury Properties', 'New Construction'],
      verified: true,
      responseTime: '1 hour',
      completedInspections: 210,
      distance: '5.1 km away'
    },
    {
      id: 3,
      name: 'Chinedu Okoro',
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      location: 'Ikeja, Lagos',
      fee: '₦6,500',
      specialties: ['Residential', 'Structural Analysis'],
      verified: true,
      responseTime: '3 hours',
      completedInspections: 450,
      distance: '8.3 km away'
    }
  ];

  const handleBookInspection = (inspector) => {
    setSelectedInspector(inspector);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData) => {
    console.log('Booking confirmed:', bookingData);
    setShowBookingModal(false);
    // Navigate to payment or confirmation
  };

  const handleBookingClose = () => {
    setShowBookingModal(false);
    setSelectedInspector(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Property Inspection</h1>
            <p className="text-sm text-blue-100">Choose a trusted inspector near you</p>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4 bg-blue-50 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-blue-900">Modern 3-Bedroom Apartment</h2>
            <div className="flex items-center gap-1 text-blue-700 text-sm">
              <MapPin className="h-3 w-3" />
              <span>Lekki Phase 1, Lagos, Nigeria</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Professional inspection before payment • Escrow protection included
            </p>
          </div>
        </div>
      </div>

      {/* Available Inspectors */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Inspectors ({inspectors.length})</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/inspector-registration')}
          >
            Become Inspector
          </Button>
        </div>
        
        <div className="space-y-4">
          {inspectors.map((inspector) => (
            <Card key={inspector.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {inspector.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{inspector.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {inspector.verified && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{inspector.experience}</span>
                          <span className="text-sm text-blue-600">• {inspector.distance}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{inspector.fee}</p>
                        <p className="text-xs text-muted-foreground">Inspection fee</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{inspector.rating}</span>
                        <span className="text-sm text-muted-foreground">({inspector.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{inspector.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{inspector.responseTime} response</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {inspector.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span>{inspector.completedInspections} completed inspections</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBookInspection(inspector)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* How It Works */}
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-900 mb-3">How Property Inspection Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <span className="text-green-600 font-bold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Choose Inspector</p>
                  <p className="text-green-700">Select from verified local inspectors</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full">
                  <span className="text-blue-600 font-bold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Secure Payment</p>
                  <p className="text-blue-700">Pay safely through our escrow system</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-purple-100 p-1 rounded-full">
                  <span className="text-purple-600 font-bold text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Get Report</p>
                  <p className="text-purple-700">Receive detailed inspection report</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && selectedInspector && (
        <InspectionBookingModal
          inspector={selectedInspector}
          property={property}
          onClose={handleBookingClose}
          onBook={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default PropertyInspection;