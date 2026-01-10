import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Star, MapPin, MessageCircle, Shield, Clock, Award, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const InspectorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const inspector = {
    name: 'Michael Johnson',
    rating: 4.9,
    reviews: 127,
    fee: 8000,
    experience: '5 years',
    location: 'Lagos Island',
    verified: true,
    specialties: ['Residential', 'Commercial', 'New Construction'],
    avatar: 'MJ',
    bio: 'Certified property inspector with over 5 years of experience in residential and commercial property inspections. Licensed by the Nigerian Institute of Building.',
    completedInspections: 340,
    responseTime: '< 2 hours',
  };

  const recentReviews = [
    { id: '1', name: 'Jane Smith', rating: 5, comment: 'Very thorough inspection. Found issues I would have missed. Highly recommended!', date: '2 days ago' },
    { id: '2', name: 'Robert Chen', rating: 5, comment: 'Professional and detailed report. Worth every naira.', date: '1 week ago' },
    { id: '3', name: 'Amina Hassan', rating: 4, comment: 'Good inspection service. Report was comprehensive.', date: '2 weeks ago' },
  ];

  const certifications = [
    'Nigerian Institute of Building (NIOB)',
    'Property Inspection Certification',
    'Structural Assessment License',
    'Electrical Systems Inspection',
  ];

  return (
    <Layout activeTab="home">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Inspector Profile</h1>
          </div>
        </div>

        {/* Inspector Info */}
        <div className="px-4 py-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-foreground text-2xl font-bold">{inspector.avatar}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{inspector.name}</h2>
              {inspector.verified && <Shield size={20} className="text-green-500" />}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{inspector.rating}</span>
              <span className="text-muted-foreground">({inspector.reviews} reviews)</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MapPin size={14} />
              <span>{inspector.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold">{inspector.completedInspections}</p>
              <p className="text-xs text-muted-foreground">Inspections</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold">{inspector.experience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold">{inspector.responseTime}</p>
              <p className="text-xs text-muted-foreground">Response</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{inspector.bio}</p>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {inspector.specialties.map((specialty, index) => (
                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Certifications</h3>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Reviews</h3>
              <button 
                onClick={() => navigate(`/inspector/${id}/reviews`)}
                className="text-sm text-primary hover:underline"
              >
                See all reviews
              </button>
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.name}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate(`/messages/${id}`)}
              className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-muted"
            >
              <MessageCircle size={18} />
              <span>Send Message</span>
            </button>
            <button 
              onClick={() => navigate(`/property-inspection/${id}`)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
            >
              Request Inspection - ₦{inspector.fee.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InspectorProfile;