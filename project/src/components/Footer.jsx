import React from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { LinkIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: LinkIcon, href: '#' },
    { name: 'Facebook', icon: LinkIcon, href: '#' },
    { name: 'Instagram', icon: LinkIcon, href: '#' },
    { name: 'LinkedIn', icon: LinkIcon, href: '#' },
  ]

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">ModernApp</h3>
            <p className="text-gray-600 leading-relaxed">
              Building beautiful, modern web experiences with cutting-edge technology and thoughtful design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200">Home</a>
              <a href="/about" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200">About</a>
              <a href="/contact" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Connect With Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-600 text-sm flex items-center">
              Made with <HeartIcon className="w-4 h-4 text-red-500 mx-1" /> by ModernApp Team
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 ModernApp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer