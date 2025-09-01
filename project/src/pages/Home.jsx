import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  RocketLaunchIcon, 
  StarIcon, 
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'

const Home = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for optimal performance and user experience.'
    },
    {
      icon: StarIcon,
      title: 'Beautiful Design',
      description: 'Carefully crafted interfaces that delight users and drive engagement.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Reliable',
      description: 'Thoroughly tested and battle-proven in production environments.'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gradient leading-tight">
                Build Something
                <br />
                <span className="relative">
                  Amazing
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce-gentle"></div>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Create stunning web experiences with our modern, responsive, and beautifully designed platform
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.open('/ui-builder', '_blank')}
                className="w-full sm:w-auto"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Try UI Builder
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-bounce-gentle"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200/30 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with beautiful design to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.title}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Product Demo"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <PlayIcon className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Coming Soon!</h4>
          <p className="text-gray-600">
            Our interactive demo is currently in development. Stay tuned for an amazing preview of what we're building!
          </p>
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(false)}
            className="w-full"
          >
            Got it!
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Home