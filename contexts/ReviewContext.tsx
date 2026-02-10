
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Review } from '../types';
import { PROJECTS } from '../services/mockData';

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
  voteReview: (reviewId: string) => void;
  getReviewsByProject: (projectId: string) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Initialize with mock reviews from PROJECTS data
  useEffect(() => {
    const initialReviews = PROJECTS.flatMap(p => p.reviews);
    
    // Check localStorage for any persisted reviews
    const storedReviews = localStorage.getItem('pygenicarc_reviews');
    if (storedReviews) {
      const parsed = JSON.parse(storedReviews);
      // Merge unique reviews
      const merged = [...initialReviews];
      parsed.forEach((r: Review) => {
        if (!merged.find(mr => mr.id === r.id)) {
          merged.push(r);
        }
      });
      setReviews(merged);
    } else {
      setReviews(initialReviews);
    }
  }, []);

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      status: 'approved', // Auto-approve for demo
    };

    setReviews(prev => {
      const updated = [newReview, ...prev];
      // Persist ONLY new/user-generated reviews to avoid duplicating mock data
      const userReviews = updated.filter(r => r.id.startsWith('rev-'));
      localStorage.setItem('pygenicarc_reviews', JSON.stringify(userReviews));
      return updated;
    });
  };

  const voteReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    ));
  };

  const getReviewsByProject = (projectId: string) => {
    return reviews.filter(r => r.projectId === projectId && r.status === 'approved');
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, voteReview, getReviewsByProject }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
