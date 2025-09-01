import React from 'react';
import { ExternalLink, Github, Mail } from 'lucide-react';

const Portfolio = ({ 
  name = "John Doe",
  title = "Full Stack Developer",
  bio = "Passionate developer creating amazing web experiences",
  project1Title = "E-commerce Platform",
  project1Description = "Modern shopping experience with React",
  project2Title = "Task Management App",
  project2Description = "Productivity tool with real-time sync",
  project3Title = "Portfolio Website",
  project3Description = "Responsive design showcase",
  skill1 = "React",
  skill1Level = 90,
  skill2 = "TypeScript",
  skill2Level = 85,
  skill3 = "Node.js",
  skill3Level = 80,
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`} style={style}>
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 shadow-2xl"></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
        <p className="text-xl text-blue-600 mb-4">{title}</p>
        <p className="text-gray-600 max-w-2xl mx-auto">{bio}</p>
      </div>

      {/* Projects Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project1Title}</h3>
              <p className="text-gray-600 mb-4">{project1Description}</p>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project2Title}</h3>
              <p className="text-gray-600 mb-4">{project2Description}</p>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project3Title}</h3>
              <p className="text-gray-600 mb-4">{project3Description}</p>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills & Expertise</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-900">{skill1}</span>
              <span className="text-gray-600">{skill1Level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${skill1Level}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-900">{skill2}</span>
              <span className="text-gray-600">{skill2Level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${skill2Level}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-900">{skill3}</span>
              <span className="text-gray-600">{skill3Level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${skill3Level}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
        <p className="text-gray-600 mb-6">Ready to start your next project? Get in touch!</p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2 mx-auto">
          <Mail className="w-5 h-5" />
          <span>Contact Me</span>
        </button>
      </div>
    </div>
  );
};

export default Portfolio;