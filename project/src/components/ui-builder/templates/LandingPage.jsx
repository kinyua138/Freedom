import React from 'react';
import { Star, Zap, Shield } from 'lucide-react';

const LandingPage = ({ 
  heroTitle = "Build Something Amazing",
  heroSubtitle = "Create stunning web experiences with our modern platform",
  ctaText = "Get Started",
  feature1Title = "Lightning Fast",
  feature1Description = "Optimized for speed and performance",
  feature2Title = "Secure",
  feature2Description = "Enterprise-grade security built-in",
  feature3Title = "Scalable",
  feature3Description = "Grows with your business needs",
  testimonialText = "This platform transformed our business completely!",
  testimonialAuthor = "Sarah Johnson, CEO",
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`} style={style}>
      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {heroTitle}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          {ctaText}
        </button>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16 px-6">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature1Title}</h3>
          <p className="text-gray-600">{feature1Description}</p>
        </div>

        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature2Title}</h3>
          <p className="text-gray-600">{feature2Description}</p>
        </div>

        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature3Title}</h3>
          <p className="text-gray-600">{feature3Description}</p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gray-50 rounded-2xl p-8 mx-6 mb-16">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl text-gray-700 mb-4 italic">
            "{testimonialText}"
          </blockquote>
          <cite className="text-gray-600 font-medium">— {testimonialAuthor}</cite>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;