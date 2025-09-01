import React from 'react';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const ECommerce = ({ 
  productName = "Premium Wireless Headphones",
  price = "$299.99",
  originalPrice = "$399.99",
  rating = "4.8",
  reviewCount = "124",
  description = "Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.",
  feature1 = "Noise Cancellation",
  feature2 = "30-Hour Battery",
  feature3 = "Wireless Charging",
  addToCartText = "Add to Cart",
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`} style={style}>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Product Image</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"></div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-600 ml-2">({reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">{price}</span>
              <span className="text-xl text-gray-500 line-through">{originalPrice}</span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">25% OFF</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{feature1}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{feature2}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{feature3}</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{addToCartText}</span>
            </button>
            
            <button className="p-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-200 hover:bg-gray-50">
              <Heart className="w-6 h-6 text-gray-600" />
            </button>
            
            <button className="p-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-200 hover:bg-gray-50">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Customer Reviews */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {[1, 2].map((review) => (
                <div key={review} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Customer {review}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Amazing quality and great customer service!</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;