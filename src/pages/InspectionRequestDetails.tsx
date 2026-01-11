import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, CheckSquare, Square, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';

const InspectionRequestDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checkedItems, setCheckedItems] = useState(new Set());

  const request = {
    id: 1,
    property: {
      title: '3-Bedroom Apartment',
      address: 'No. 15 Admiralty Way, Lekki Phase 1, Lagos',
      price: '₦150,000/month',
      images: ['/src/assets/property-1.jpg', '/src/assets/property-2.jpg'],
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      size: '120 sqm'
    },
    client: {
      name: 'John Doe',
      phone: '+234 801 234 5678',
      email: 'john.doe@email.com',
      avatar: 'JD'
    },
    fee: '₦10,000',
    status: 'pending',
    date: '2024-01-15',
    urgency: 'normal',
    checklist: [
      'Check plumbing systems',
      'Inspect electrical wiring',
      'Examine structural integrity',
      'Test water pressure in all taps',
      'Check for water damage in kitchen',
      'Inspect ceiling for cracks',
      'Test all electrical outlets',
      'Check door and window locks'
    ],
    specialRequests: 'Please pay special attention to the kitchen area as there were reports of water leakage. Also check if the electrical system can handle high-power appliances.'
  };

  const toggleCheckItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Inspection Request</h1>
            <p className="text-sm text-blue-100">Request #{request.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img 
                  src={request.property.images[0]} 
                  alt={request.property.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold">{request.property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{request.property.address}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{request.property.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{request.property.size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <p className="font-medium">{request.property.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <p className="font-medium">{request.property.bathrooms}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="text-lg font-bold text-green-600">{request.property.price}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">{request.client.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{request.client.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{request.client.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{request.client.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Client
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {request.checklist.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleCheckItem(index)}
                >
                  {checkedItems.has(index) ? (
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`flex-1 ${checkedItems.has(index) ? 'line-through text-muted-foreground' : ''}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Progress: {checkedItems.size}/{request.checklist.length} items completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{request.specialRequests}</p>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Inspection Fee:</span>
                <p className="font-semibold text-green-600">{request.fee}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Request Date:</span>
                <p className="font-medium">{request.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                  {request.status}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant={request.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                  {request.urgency}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Decline Request
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Calendar className="h-4 w-4 mr-2" />
              Accept & Schedule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionRequestDetails;