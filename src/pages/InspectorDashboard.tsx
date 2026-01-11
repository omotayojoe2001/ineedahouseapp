import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Star, MapPin, Clock, DollarSign, MessageCircle, CheckCircle, Calendar, Shield, Edit, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const InspectorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');

  const inspectionRequests = [
    {
      id: 1,
      property: {
        title: '3-Bedroom Apartment',
        address: 'No. 15 Admiralty Way, Lekki Phase 1, Lagos',
        price: '₦150,000/month',
        image: '/src/assets/property-1.jpg',
        type: 'Apartment'
      },
      client: {
        name: 'John Doe',
        phone: '+234 801 234 5678',
        email: 'john.doe@email.com'
      },
      fee: '₦10,000',
      status: 'pending',
      date: '2024-01-15',
      urgency: 'normal',
      requestDetails: 'Please check plumbing, electrical systems, and structural integrity. Client is particularly concerned about water damage in the kitchen area.'
    },
    {
      id: 2,
      property: {
        title: '4-Bedroom Duplex',
        address: 'Plot 45 Tiamiyu Savage Street, Victoria Island, Lagos',
        price: '₦300,000/month',
        image: '/src/assets/property-2.jpg',
        type: 'Duplex'
      },
      client: {
        name: 'Sarah Johnson',
        phone: '+234 802 345 6789',
        email: 'sarah.j@email.com'
      },
      fee: '₦15,000',
      status: 'accepted',
      date: '2024-01-16',
      urgency: 'urgent',
      requestDetails: 'Urgent inspection needed for new construction. Check foundation, roofing, and all installations.'
    }
  ];

  const completedInspections = [
    {
      id: 1,
      property: '2-Bedroom Flat',
      location: 'Ikeja, Lagos',
      client: 'Mike Chen',
      fee: '₦8,000',
      rating: 5,
      date: '2024-01-10'
    }
  ];

  return (
    <Layout activeTab="profile">
      <div className="min-h-screen bg-background p-4 desktop-nav-spacing">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Inspector Dashboard</h1>
          <p className="text-muted-foreground">Manage your property inspection requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-lg font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-lg font-bold">45</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-lg font-bold">4.9</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-lg font-bold">₦450k</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            size="sm"
            className="whitespace-nowrap"
          >
            Requests
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'default' : 'outline'}
            onClick={() => setActiveTab('completed')}
            size="sm"
            className="whitespace-nowrap"
          >
            Completed
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
            size="sm"
            className="whitespace-nowrap"
          >
            Profile
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reviews')}
            size="sm"
            className="whitespace-nowrap"
          >
            Reviews
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {inspectionRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <img 
                      src={request.property.image} 
                      alt={request.property.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{request.property.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{request.property.address}</span>
                          </div>
                          <p className="text-xs font-medium text-green-600">{request.property.price}</p>
                        </div>
                        <Badge variant={request.urgency === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                          {request.urgency}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted/30 p-2 rounded text-xs mb-2">
                        <p className="font-medium mb-1">Request:</p>
                        <p className="text-muted-foreground line-clamp-2">{request.requestDetails}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span>Client: {request.client.name}</span>
                        <span className="font-semibold text-green-600">{request.fee}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/messages/${request.client.name}`)}
                          className="text-xs px-2 py-1 h-7"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/inspection-request/${request.id}`)}
                          className="text-xs px-2 py-1 h-7"
                        >
                          View
                        </Button>
                        {request.status === 'pending' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => console.log('Declined request', request.id)}
                              className="text-xs px-2 py-1 h-7"
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => console.log('Accepted request', request.id)}
                              className="text-xs px-2 py-1 h-7"
                            >
                              Accept
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Accepted</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedInspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{inspection.property}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {inspection.location}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">Client: {inspection.client}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{inspection.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{inspection.fee}</p>
                      <p className="text-sm text-muted-foreground">{inspection.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspector Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">AO</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Adebayo Ogundimu</h3>
                    <p className="text-sm text-muted-foreground">Property Inspector</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-xs text-muted-foreground">(127)</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setActiveTab('edit-profile')}>Edit</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <p className="text-sm">Lekki, Lagos</p>
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <p className="text-sm">8 years</p>
                  </div>
                  <div>
                    <Label>Fee Range</Label>
                    <p className="text-sm">₦8,000 - ₦15,000</p>
                  </div>
                  <div>
                    <Label>Response Time</Label>
                    <p className="text-sm">2 hours average</p>
                  </div>
                </div>
                
                <div>
                  <Label>Bio</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Experienced property inspector with 8 years in residential and commercial properties. 
                    Specialized in structural analysis and new construction inspection.
                  </p>
                </div>
                
                <div>
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Residential</Badge>
                    <Badge variant="outline">Commercial</Badge>
                    <Badge variant="outline">Structural Analysis</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Professional Certificates</Label>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('add-certificate')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Certificate
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Real Estate License</h4>
                      <p className="text-sm text-muted-foreground">Licensed real estate professional with inspection certification</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Structural Engineering Certificate</h4>
                      <p className="text-sm text-muted-foreground">Certified in structural analysis and building safety assessment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      client: 'John Doe',
                      rating: 5,
                      date: '2024-01-10',
                      comment: 'Excellent inspector! Very thorough and professional. Found issues I would have missed.'
                    },
                    {
                      client: 'Sarah Johnson',
                      rating: 5,
                      date: '2024-01-08',
                      comment: 'Highly recommend! Detailed report and great communication throughout the process.'
                    },
                    {
                      client: 'Mike Chen',
                      rating: 4,
                      date: '2024-01-05',
                      comment: 'Good inspection service. Arrived on time and covered all areas thoroughly.'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.client}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'edit-profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input defaultValue="Adebayo Ogundimu" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue="+234 801 234 5678" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input defaultValue="Lekki, Lagos" />
                  </div>
                  <div>
                    <Label>Fee Range</Label>
                    <Input defaultValue="₦8,000 - ₦15,000" />
                  </div>
                </div>
                
                <div>
                  <Label>Bio</Label>
                  <Textarea 
                    defaultValue="Experienced property inspector with 8 years in residential and commercial properties. Specialized in structural analysis and new construction inspection."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => setActiveTab('profile')}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setActiveTab('profile')}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'add-certificate' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Certificate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Certificate Name</Label>
                  <Input placeholder="e.g., Real Estate License" />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="What does this certificate cover?" rows={3} />
                </div>
                
                <div>
                  <Label>Upload Certificate</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Choose certificate file</p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => setActiveTab('profile')}>Add Certificate</Button>
                  <Button variant="outline" onClick={() => setActiveTab('profile')}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default InspectorDashboard;