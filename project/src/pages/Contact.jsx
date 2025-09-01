import React, { useState } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import Button from '../components/Button'
import Card from '../components/Card'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      description: 'hello@modernapp.com',
      action: 'mailto:hello@modernapp.com'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      description: '123 Innovation St, Tech City',
      action: '#'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      // Simulate form submission
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 animate-slide-up">
              Get In
              <span className="text-gradient block">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Ready to start your next project? We'd love to hear from you and discuss how we can help bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 resize-none ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Tell us about your project or ask us anything..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  We're here to help and answer any questions you might have. We look forward to hearing from you!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <a
                      key={info.title}
                      href={info.action}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/80 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {info.title}
                        </h3>
                        <p className="text-gray-600">{info.description}</p>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500 font-medium">Interactive Map</p>
                      <p className="text-gray-400 text-sm">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact