import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, DollarSign, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InspectorIntroCarousel = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      icon: DollarSign,
      title: "Earn Great Money",
      subtitle: "₦5,000 - ₦15,000 per inspection",
      description: "Work on your own schedule and earn based on your availability. Join thousands of inspectors already earning.",
      features: [
        "Flexible working hours",
        "Competitive inspection fees",
        "Weekly payments via bank transfer",
        "Bonus for high ratings"
      ],
      bgImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-green-600/90 to-emerald-800/90"
    },
    {
      icon: Shield,
      title: "Trusted & Secure",
      subtitle: "Verified Professional Network",
      description: "Join a verified network of professional inspectors. All payments are secured through our escrow system with full insurance coverage.",
      features: [
        "Verified inspector badge",
        "Secure escrow payments",
        "Insurance coverage included",
        "Professional support team"
      ],
      bgImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-blue-600/90 to-indigo-800/90"
    },
    {
      icon: Clock,
      title: "How It Works",
      subtitle: "Simple 4-Step Process",
      description: "Get started in minutes with our streamlined onboarding process. Start earning within 24 hours of approval.",
      features: [
        "Complete registration & verification",
        "Receive inspection requests nearby",
        "Conduct inspection & get paid",
        "Build your reputation & earn more"
      ],
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-purple-600/90 to-violet-800/90"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isAnimating || currentSlide === 0) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentSlide(currentSlide - 1);
      setIsAnimating(false);
    }, 150);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 150);
  };

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating && currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${slide.bgImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000 ease-in-out`} />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white">
        {/* Header */}
        <div className="p-6 pt-12">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium opacity-90">
              Inspector Registration
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
              className="text-white hover:bg-white/20"
            >
              Skip
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col justify-center px-6 transform transition-all duration-700 ease-out ${
          isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          {/* Icon */}
          <div className="mb-8 transform transition-all duration-500 ease-out delay-200">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Icon className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/90">
              {slide.subtitle}
            </p>
            <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
              {slide.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-sm mx-auto">
            {slide.features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-4 transform transition-all duration-500 ease-out ${
                  isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-6 pb-12">
          {/* Progress Dots */}
          <div className="flex justify-center gap-3 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? 'w-8 h-2 bg-white' 
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`text-white hover:bg-white/20 transition-all duration-300 ${
                currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextSlide}
              className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorIntroCarousel;