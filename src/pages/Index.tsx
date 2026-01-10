import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import Explore from './Explore';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <Explore />;
};

export default Index;
