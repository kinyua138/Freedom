import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog = ({ 
  featuredTitle = "The Future of Web Development",
  featuredExcerpt = "Exploring the latest trends and technologies shaping the web development landscape in 2025.",
  post1Title = "Getting Started with React",
  post1Excerpt = "A comprehensive guide to building modern web applications",
  post2Title = "CSS Grid vs Flexbox",
  post2Excerpt = "Understanding when to use each layout method",
  post3Title = "JavaScript Best Practices",
  post3Excerpt = "Writing clean, maintainable code that scales",
  authorName = "Jane Smith",
  authorBio = "Senior Frontend Developer with 8+ years of experience in modern web technologies.",
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`} style={style}>
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Tech Blog</h1>
        <p className="text-xl text-gray-600">Insights, tutorials, and thoughts on modern development</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Post */}
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100"></div>
            <div className="p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 15, 2024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredTitle}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{featuredExcerpt}</p>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100"></div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 12, 2024</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post1Title}
                </h3>
                <p className="text-gray-600 mb-4">{post1Excerpt}</p>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100"></div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 10, 2024</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post2Title}
                </h3>
                <p className="text-gray-600 mb-4">{post2Excerpt}</p>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          </div>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100"></div>
            <div className="p-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>Dec 8, 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post3Title}
              </h3>
              <p className="text-gray-600 mb-4">{post3Excerpt}</p>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author Bio */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Author</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <h4 className="font-semibold text-gray-900">{authorName}</h4>
                <p className="text-gray-600 text-sm">Senior Developer</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{authorBio}</p>
          </div>

          {/* Popular Posts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Posts</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex space-x-3 group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                      Popular Article {item}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">Dec {15 - item}, 2024</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;