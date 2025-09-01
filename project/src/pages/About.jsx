import React from 'react'
import { 
  UserGroupIcon, 
  LightBulbIcon, 
  HeartIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'
import Card from '../components/Card'

const About = () => {
  const values = [
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We constantly push boundaries to create cutting-edge solutions that solve real problems.'
    },
    {
      icon: UserGroupIcon,
      title: 'Collaboration',
      description: 'We believe the best results come from working together and sharing diverse perspectives.'
    },
    {
      icon: HeartIcon,
      title: 'Passion',
      description: 'We love what we do and it shows in every detail of our work and customer relationships.'
    },
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'We strive for perfection in everything we create, from code quality to user experience.'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About Our
                <span className="text-gradient block">Mission</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                We're a passionate team of designers and developers dedicated to creating 
                beautiful, functional, and user-centered digital experiences that make a difference.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Founded in 2020</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">50+ Projects Completed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Global Team of Experts</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center animate-bounce-gentle">
                <TrophyIcon className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we work with our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={value.title}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2 animate-slide-up">
              <div className="text-4xl lg:text-5xl font-bold text-gradient">50+</div>
              <div className="text-gray-600 font-medium">Projects Delivered</div>
            </div>
            <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-gradient">99%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
            <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-gradient">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About