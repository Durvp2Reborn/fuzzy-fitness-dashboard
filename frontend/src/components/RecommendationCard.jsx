import React from 'react';

/**
 * RecommendationCard - Card component for displaying natural language recommendations
 */
const RecommendationCard = ({ 
  title, 
  recommendation, 
  icon = '💡',
  variant = 'default'
}) => {
  // Variant styles
  const variants = {
    default: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    warning: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
    info: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
  };

  return (
    <div className={`rounded-xl border p-5 ${variants[variant] || variants.default}`}>
      <div className="flex items-start space-x-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
