import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Star, MapPin, MessageCircle, Shield, Clock, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PropertyInspection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedInspector, setSelectedInspector] = useState<string | null>(null);

  const inspectors = [
    {
      id: '1',
      name: 'Michael Johnson',
      rating: 4.9,
      reviews: 127,
      fee: 8000,
      experience: '5 years',
      location: 'Lagos Island',
      verified: true,
      specialties: ['Residential', 'Commercial'],
      avatar: 'MJ',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      rating: 4.8,
      reviews: 89,
      fee: 12000,
      experience: '7 years',
      location: 'Victoria Island',
      verified: true,
      specialties: ['Luxury Homes', 'Apartments'],
      avatar: 'SW',
    },
    {
      id: '3',
      name: 'David Okafor',
      rating: 4.7,
      reviews: 156,
      fee: 6500,
      experience: '4 years',
      location: 'Lekki',
      verified: true,
      specialties: ['New Builds', 'Condos'],
      avatar: 'DO',
    },
  ];

  const handleSelectInspector = (inspectorId: string) => {
    setSelectedInspector(inspectorId);
  };

  const handleRequestInspection = () => {
    if (selectedInspector) {
      // Handle inspection request
      alert('Inspection request sent!');
    }
  };

  const handleMessageInspector = (inspectorId: string) => {
    navigate(`/messages/${inspectorId}`);
  };

  return (
    <Layout activeTab="home">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Request Property Inspection</h1>
              <p className="text-sm text-muted-foreground">Hire a trusted local inspector to verify this property before payment</p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm font-medium mb-1">Inspection Fee Range</p>
            <p className="text-lg font-bold text-primary">₦5,000 - ₦15,000</p>
          </div>
        </div>

        {/* Inspectors List */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">Available Inspectors</h2>
          
          <div className="space-y-4">
            {inspectors.map((inspector) => (
              <div 
                key={inspector.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedInspector === inspector.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/30'
                }`}
                onClick={() => handleSelectInspector(inspector.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">{inspector.avatar}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{inspector.name}</h3>
                      {inspector.verified && (
                        <Shield size={16} className="text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{inspector.rating}</span>
                        <span>({inspector.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{inspector.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{inspector.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">₦{inspector.fee.toLocaleString()}</p>
                        <div className="flex gap-1 mt-1">
                          {inspector.specialties.map((specialty, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageInspector(inspector.id);
                          }}
                          className="p-2 border border-border rounded-lg hover:bg-muted"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/inspector/${inspector.id}`);
                          }}
                          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Button */}
        {selectedInspector && (
          <div className="fixed bottom-20 lg:bottom-6 left-0 right-0 px-4">
            <button 
              onClick={handleRequestInspection}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium shadow-lg"
            >
              Request Inspection
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropertyInspection;