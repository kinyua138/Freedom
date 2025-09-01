import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

const EmailTemplate = ({ 
  headerTitle = "Weekly Newsletter",
  headerSubtitle = "Stay updated with our latest news",
  introText = "Hello! We're excited to share some amazing updates with you this week.",
  ctaText = "Read Full Article",
  ctaUrl = "#",
  footerText = "Thanks for being part of our community!",
  companyName = "ModernApp",
  unsubscribeText = "Unsubscribe",
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto bg-white ${className}`} style={style}>
      {/* Email Container */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{headerTitle}</h1>
          <p className="text-blue-100">{headerSubtitle}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Intro */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">{introText}</p>
          </div>

          {/* Featured Content */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Featured Article</h3>
                <p className="text-gray-600 mb-4">Discover the latest trends and insights in our comprehensive guide to modern web development.</p>
                <a
                  href={ctaUrl}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <span>{ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Link 1</h4>
              <p className="text-gray-600 text-sm">Access our resources</p>
            </div>

            <div className="text-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Link 2</h4>
              <p className="text-gray-600 text-sm">Explore our tools</p>
            </div>
          </div>

          {/* Closing */}
          <div className="text-center">
            <p className="text-gray-700 mb-6">{footerText}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">© 2025 {companyName}. All rights reserved.</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">{unsubscribeText}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;