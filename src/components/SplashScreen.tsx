import React, { useEffect } from 'react';
import { Home, Shield, CheckCircle } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary flex items-center justify-center px-6 z-50">
      <div className="text-center text-primary-foreground">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">INeedAHouse</h1>
          <p className="text-lg opacity-90">Find. Verify. Move.</p>
        </div>
        
        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-sm opacity-75">
            <Shield size={16} />
            <span>Verified Properties</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-sm opacity-75">
            <CheckCircle size={16} />
            <span>S-Crew Escrow Protection</span>
          </div>
        </div>
        
        {/* Loading Indicator */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;