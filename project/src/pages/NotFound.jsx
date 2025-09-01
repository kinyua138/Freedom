import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ExclamationTriangleIcon, 
  HomeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline'
import Button from '../components/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="space-y-8">
          {/* 404 Illustration */}
          <div className="relative animate-slide-up">
            <div className="text-8xl lg:text-9xl font-bold text-gradient opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-gentle">
                <ExclamationTriangleIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="primary"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-gray-200/50 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Homepage
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                About Us
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound