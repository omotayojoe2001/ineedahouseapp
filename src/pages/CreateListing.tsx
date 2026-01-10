import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page since create listing is now handled via modal
    navigate('/');
  }, [navigate]);

  return null;
};

export default CreateListing;