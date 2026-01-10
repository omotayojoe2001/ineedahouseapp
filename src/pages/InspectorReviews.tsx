import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Star, Filter, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const InspectorReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('most-relevant');

  const allReviews = [
    { id: '1', name: 'Jane Smith', rating: 5, comment: 'Very thorough inspection. Found issues I would have missed. Highly recommended!', date: '2 days ago', helpful: 12 },
    { id: '2', name: 'Robert Chen', rating: 5, comment: 'Professional and detailed report. Worth every naira.', date: '1 week ago', helpful: 8 },
    { id: '3', name: 'Amina Hassan', rating: 4, comment: 'Good inspection service. Report was comprehensive.', date: '2 weeks ago', helpful: 5 },
    { id: '4', name: 'David Okafor', rating: 5, comment: 'Excellent work! Very detailed and professional.', date: '3 weeks ago', helpful: 15 },
    { id: '5', name: 'Sarah Williams', rating: 3, comment: 'Decent service but took longer than expected.', date: '1 month ago', helpful: 2 },
    { id: '6', name: 'Michael Johnson', rating: 4, comment: 'Good inspector, found several important issues.', date: '1 month ago', helpful: 7 },
    { id: '7', name: 'Grace Emeka', rating: 5, comment: 'Outstanding service! Very thorough and professional.', date: '2 months ago', helpful: 20 },
    { id: '8', name: 'John Adebayo', rating: 2, comment: 'Service was okay but report lacked detail.', date: '2 months ago', helpful: 1 },
  ];

  const ratingCounts = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length,
  };

  const filteredReviews = selectedRating 
    ? allReviews.filter(review => review.rating === selectedRating)
    : allReviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'most-recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'highest-rating':
        return b.rating - a.rating;
      case 'lowest-rating':
        return a.rating - b.rating;
      case 'most-helpful':
        return b.helpful - a.helpful;
      default: // most-relevant
        return b.helpful - a.helpful;
    }
  });

  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

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
              <h1 className="text-xl font-bold">Reviews</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">({allReviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="px-4 py-4 border-b border-border">
          {/* Rating Filters */}
          <div className="mb-4">
            <h3 className="font-medium mb-3">Filter by rating</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  selectedRating === null 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'border-border hover:bg-muted'
                }`}
              >
                All ({allReviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-1 ${
                    selectedRating === rating 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span>{rating}</span>
                  <span>({ratingCounts[rating]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="font-medium mb-3">Sort by</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background appearance-none pr-8"
              >
                <option value="most-relevant">Most Relevant</option>
                <option value="most-recent">Most Recent</option>
                <option value="highest-rating">Highest Rating</option>
                <option value="lowest-rating">Lowest Rating</option>
                <option value="most-helpful">Most Helpful</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 py-4">
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedReviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews found for the selected rating.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InspectorReviews;